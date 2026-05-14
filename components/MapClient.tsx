'use client';
import { useEffect, useRef, useState } from 'react';

interface Place { name: string; type: 'hospital' | 'police' | 'fire'; lat: number; lng: number; dist?: string; }

const NEARBY_PLACES = (lat: number, lng: number): Place[] => [
  { name: 'City Hospital',         type: 'hospital', lat: lat + 0.005, lng: lng + 0.004, dist: '0.6 km' },
  { name: 'Govt Medical College',  type: 'hospital', lat: lat - 0.007, lng: lng + 0.009, dist: '1.1 km' },
  { name: 'Apollo Clinic',         type: 'hospital', lat: lat + 0.011, lng: lng - 0.005, dist: '1.4 km' },
  { name: 'Police Station',        type: 'police',   lat: lat + 0.003, lng: lng - 0.006, dist: '0.7 km' },
  { name: 'Traffic Police Post',   type: 'police',   lat: lat - 0.009, lng: lng + 0.002, dist: '1.0 km' },
  { name: 'Fire Station',          type: 'fire',     lat: lat - 0.004, lng: lng - 0.003, dist: '0.5 km' },
];

const TYPE_COLOR: Record<string, string> = { hospital: '#74d8bd', police: '#60a5fa', fire: '#fb923c' };
const TYPE_EMOJI: Record<string, string> = { hospital: '🏥', police: '👮', fire: '🚒' };

interface MapClientProps {
  filter?: string;
}

export default function MapClient({ filter = 'all' }: MapClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);
  const markersRef = useRef<{ element: HTMLElement; place: Place }[]>([]);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [error, setError] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [activePlace, setActivePlace] = useState<Place | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setLocation([pos.coords.longitude, pos.coords.latitude]),
      () => {
        setLocation([77.1025, 28.7041]);
        setError('Using default location (Delhi). Enable GPS for accurate results.');
      },
      { timeout: 8000 }
    );
  }, []);

  // Update marker visibility when filter changes
  useEffect(() => {
    markersRef.current.forEach(({ element, place }) => {
      element.style.display = (filter === 'all' || place.type === filter) ? 'block' : 'none';
    });
  }, [filter]);

  useEffect(() => {
    if (!location || !containerRef.current) return;
    const nearby = NEARBY_PLACES(location[1], location[0]);
    setPlaces(nearby);

    let map: { remove: () => void } | null = null;

    const init = async () => {
      const sdk = await import('@maptiler/sdk');
      await import('@maptiler/sdk/dist/maptiler-sdk.css');

      sdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY as string;

      map = new sdk.Map({
        container: containerRef.current!,
        style: sdk.MapStyle.STREETS.DARK,
        center: location,
        zoom: 14,
      }) as { remove: () => void };

      const typedMap = map as unknown as InstanceType<typeof sdk.Map>;

      // User marker (pulsing red)
      const el = document.createElement('div');
      el.style.cssText = 'width:20px;height:20px;border-radius:50%;background:#e11d48;border:3px solid #fff;box-shadow:0 0 12px rgba(225,29,72,0.8);position:relative;';
      const ring = document.createElement('div');
      ring.style.cssText = 'position:absolute;inset:-8px;border-radius:50%;border:2px solid rgba(225,29,72,0.4);animation:pulse-ring 1.8s ease-out infinite;';
      el.appendChild(ring);
      new sdk.Marker({ element: el }).setLngLat(location).addTo(typedMap);

      // Place markers
      const newMarkers: { element: HTMLElement; place: Place }[] = [];
      nearby.forEach(p => {
        const c = TYPE_COLOR[p.type];
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `display:${filter === 'all' || p.type === filter ? 'block' : 'none'}`;

        const pe = document.createElement('div');
        pe.style.cssText = `width:16px;height:16px;border-radius:50%;background:${c};border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.5);cursor:pointer;`;
        wrapper.appendChild(pe);

        new sdk.Marker({ element: wrapper }).setLngLat([p.lng, p.lat]).setPopup(
          new sdk.Popup({ offset: 20, closeButton: false }).setHTML(
            `<div style="font-family:Inter,sans-serif;padding:4px 2px">
              <div style="font-size:12px;font-weight:700;color:#111;margin-bottom:2px">${p.name}</div>
              <div style="font-size:11px;color:#666">${TYPE_EMOJI[p.type]} ${p.dist ?? ''}</div>
            </div>`
          )
        ).addTo(typedMap);

        newMarkers.push({ element: wrapper, place: p });
      });

      markersRef.current = newMarkers;
      mapRef.current = map;
    };

    init().catch(console.error);
    return () => {
      map?.remove();
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const filtered = filter === 'all' ? places : places.filter(p => p.type === filter);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', minHeight: '320px' }}>
      {error && (
        <div style={{
          position: 'absolute', top: '12px', left: '12px', right: '12px', zIndex: 10,
          background: 'rgba(18,20,20,0.92)', border: '1px solid var(--outline)',
          borderRadius: 'var(--r-md)', padding: '10px 14px',
          fontSize: '12px', color: 'var(--text-muted)',
        }}>
          ⚠️ {error}
        </div>
      )}

      {!location && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, background: 'var(--surface)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid var(--surface-high)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Getting your location…</p>
          </div>
        </div>
      )}

      <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '320px' }} />

      {/* Floating places list */}
      {filtered.length > 0 && (
        <div style={{
          position: 'absolute', bottom: '12px', left: '12px', right: '12px', zIndex: 10,
          display: 'flex', gap: '8px', overflowX: 'auto',
          paddingBottom: '2px',
        }}>
          {filtered.map((p, i) => (
            <div
              key={i}
              onClick={() => setActivePlace(activePlace?.name === p.name ? null : p)}
              style={{
                flexShrink: 0,
                background: 'rgba(18,20,20,0.92)', backdropFilter: 'blur(12px)',
                border: `1px solid ${activePlace?.name === p.name ? TYPE_COLOR[p.type] : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 'var(--r-md)', padding: '8px 12px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: TYPE_COLOR[p.type], flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}>{p.name}</p>
                {p.dist && <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.dist}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
