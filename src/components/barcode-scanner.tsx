'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, X, Loader2, Search } from 'lucide-react';

interface FoodResult {
  name: string;
  brand: string | null;
  barcode: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  image_url?: string;
}

interface BarcodeScannerProps {
  onFoodFound: (food: FoodResult) => void;
  onClose: () => void;
}

async function lookupBarcode(barcode: string): Promise<FoodResult | null> {
  try {
    const res = await fetch(
      `/api/nutrition/search?barcode=${encodeURIComponent(barcode)}`
    );
    if (!res.ok) return null;

    const results = await res.json();
    if (!Array.isArray(results) || results.length === 0) return null;

    const item = results[0];
    return {
      name: item.name || 'Produit inconnu',
      brand: item.brand || null,
      barcode,
      calories_per_100g: item.calories_per_100g ?? 0,
      protein_per_100g: item.protein_per_100g ?? 0,
      carbs_per_100g: item.carbs_per_100g ?? 0,
      fat_per_100g: item.fat_per_100g ?? 0,
      image_url: item.image_url,
    };
  } catch {
    return null;
  }
}

export function BarcodeScanner({ onFoodFound, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<any>(null);
  const [status, setStatus] = useState<'loading' | 'scanning' | 'found' | 'not-found' | 'error'>('loading');
  const [scannedFood, setScannedFood] = useState<FoodResult | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');
  const processedRef = useRef(false);

  const handleBarcode = useCallback(async (barcode: string) => {
    if (processedRef.current) return;
    processedRef.current = true;

    setStatus('found');

    const food = await lookupBarcode(barcode);
    if (food) {
      setScannedFood(food);
    } else {
      setStatus('not-found');
      processedRef.current = false;
    }
  }, []);

  useEffect(() => {
    let scanner: any = null;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (!scannerRef.current) return;

        scanner = new Html5Qrcode('barcode-reader');
        html5QrCodeRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 280, height: 150 },
            aspectRatio: 1.0,
          },
          (decodedText: string) => {
            handleBarcode(decodedText);
          },
          () => {} // ignore errors during scanning
        );

        setStatus('scanning');
      } catch {
        setStatus('error');
      }
    }

    startScanner();

    return () => {
      if (scanner) {
        scanner.stop().catch(() => {});
      }
    };
  }, [handleBarcode]);

  async function handleManualSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!manualBarcode.trim()) return;
    await handleBarcode(manualBarcode.trim());
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Camera size={20} className="text-brand" />
          Scanner un produit
        </h2>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center hover:bg-border transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scanner viewport */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {!scannedFood ? (
          <>
            <div
              id="barcode-reader"
              ref={scannerRef}
              className="w-full max-w-sm rounded-2xl overflow-hidden border border-border"
            />

            {status === 'loading' && (
              <div className="mt-4 flex items-center gap-2 text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                Initialisation de la caméra...
              </div>
            )}

            {status === 'scanning' && (
              <p className="mt-4 text-sm text-gray-400">
                Place le code-barres dans le cadre
              </p>
            )}

            {status === 'not-found' && (
              <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
                Produit non trouvé. Réessaie ou entre le code manuellement.
              </div>
            )}

            {status === 'error' && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                Impossible d&apos;accéder à la caméra. Utilise la saisie manuelle.
              </div>
            )}

            {/* Manual barcode input */}
            <form onSubmit={handleManualSearch} className="mt-6 w-full max-w-sm">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    placeholder="Saisir un code-barres..."
                    className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-brand/50 focus:outline-none transition-colors text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-3 bg-brand rounded-xl text-white font-medium text-sm hover:bg-brand-400 transition-colors"
                >
                  Chercher
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Food Result Card */
          <div className="w-full max-w-sm bg-surface rounded-3xl p-6 border border-border space-y-4">
            <div className="flex gap-4">
              {scannedFood.image_url && (
                <img
                  src={scannedFood.image_url}
                  alt={scannedFood.name}
                  className="w-20 h-20 rounded-xl object-cover bg-border"
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg">{scannedFood.name}</h3>
                {scannedFood.brand && (
                  <p className="text-sm text-gray-400">{scannedFood.brand}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Code: {scannedFood.barcode}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="text-center p-3 rounded-xl bg-background">
                <div className="text-xs text-gray-400 mb-1">Cal</div>
                <div className="font-bold text-brand">{scannedFood.calories_per_100g}</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-background">
                <div className="text-xs text-gray-400 mb-1">Prot</div>
                <div className="font-bold text-macro-protein">{scannedFood.protein_per_100g}g</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-background">
                <div className="text-xs text-gray-400 mb-1">Glu</div>
                <div className="font-bold text-macro-carbs">{scannedFood.carbs_per_100g}g</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-background">
                <div className="text-xs text-gray-400 mb-1">Lip</div>
                <div className="font-bold text-macro-fat">{scannedFood.fat_per_100g}g</div>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center">Pour 100g</p>

            <div className="flex gap-3">
              <button
                onClick={() => onFoodFound(scannedFood)}
                className="flex-1 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold py-3.5 rounded-xl active:scale-[0.98] transition-all"
              >
                Ajouter
              </button>
              <button
                onClick={() => {
                  setScannedFood(null);
                  setStatus('scanning');
                  processedRef.current = false;
                }}
                className="px-5 py-3.5 rounded-xl bg-border hover:bg-surface-hover text-white font-medium transition-colors"
              >
                Re-scanner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
