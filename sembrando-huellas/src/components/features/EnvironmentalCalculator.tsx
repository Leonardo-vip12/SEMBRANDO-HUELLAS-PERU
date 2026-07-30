import { useState, useCallback } from 'react';
import { Leaf, Droplets, ShoppingBag, Calculator, RefreshCw } from 'lucide-react';
import { CalculatorService, type CalculatorResult, type CalculatorType } from '@/services/calculator';
import Button from '@/components/buttons/Button';
import CardBase from '@/components/cards/CardBase';
import { cn } from '@/lib/cn';

const calculatorTypes: { id: CalculatorType; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'carbon', label: 'Huella de Carbono', icon: <Leaf size={20} />, color: 'text-green-500' },
  { id: 'water', label: 'Huella Hídrica', icon: <Droplets size={20} />, color: 'text-blue-500' },
  { id: 'plastic', label: 'Huella de Plástico', icon: <ShoppingBag size={20} />, color: 'text-amber-500' },
];

export default function EnvironmentalCalculator() {
  const [activeType, setActiveType] = useState<CalculatorType>('carbon');
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const [carbonInput, setCarbonInput] = useState({ transporte: 'publico', electricidad: 200, alimentacion: 'mixta', residuos: 'moderado' });
  const [waterInput, setWaterInput] = useState({ ducha: 10, lavado: 3, jardin: 2, cocina: 4 });
  const [plasticInput, setPlasticInput] = useState({ botellas: 3, bolsas: 5, empaques: 4, otros: 1 });

  const handleCalculate = useCallback(() => {
    let res: CalculatorResult;
    switch (activeType) {
      case 'carbon':
        res = CalculatorService.calculate(carbonInput, 'carbon');
        break;
      case 'water':
        res = CalculatorService.calculate(waterInput, 'water');
        break;
      case 'plastic':
        res = CalculatorService.calculate(plasticInput, 'plastic');
        break;
    }
    setResult(res!);
  }, [activeType, carbonInput, waterInput, plasticInput]);

  const handleReset = useCallback(() => {
    setResult(null);
  }, []);

  const activeConfig = calculatorTypes.find((t) => t.id === activeType)!;

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-3">
        {calculatorTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => { setActiveType(type.id); setResult(null); }}
            className={cn(
              'flex items-center gap-2 rounded-xl border-2 px-4 py-3 font-medium transition-all',
              activeType === type.id
                ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 dark:border-neutral-700 dark:text-neutral-400',
            )}
          >
            <span className={type.color}>{type.icon}</span>
            {type.label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <CardBase variant="default" padding="lg">
          <h3 className="mb-6 text-lg font-medium text-neutral-900 dark:text-neutral-100">
            <span className="inline-flex items-center gap-2">
              <Calculator size={20} className="text-primary-500" />
              {activeConfig.label}
            </span>
          </h3>

          {activeType === 'carbon' && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Transporte principal</label>
                <select value={carbonInput.transporte} onChange={(e) => setCarbonInput({ ...carbonInput, transporte: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100">
                  <option value="publico">Transporte público</option>
                  <option value="privado">Auto privado</option>
                  <option value="moto">Moto</option>
                  <option value="bici">Bicicleta</option>
                  <option value="ninguno">Ninguno</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Consumo eléctrico mensual (kWh)</label>
                <input type="number" value={carbonInput.electricidad} onChange={(e) => setCarbonInput({ ...carbonInput, electricidad: Number(e.target.value) })}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Tipo de alimentación</label>
                <select value={carbonInput.alimentacion} onChange={(e) => setCarbonInput({ ...carbonInput, alimentacion: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100">
                  <option value="vegano">Vegano</option>
                  <option value="vegetariano">Vegetariano</option>
                  <option value="mixta">Mixta</option>
                  <option value="carnivoro">Alto consumo de carne</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Generación de residuos</label>
                <select value={carbonInput.residuos} onChange={(e) => setCarbonInput({ ...carbonInput, residuos: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100">
                  <option value="minimo">Mínimo (recicla todo)</option>
                  <option value="moderado">Moderado</option>
                  <option value="alto">Alto</option>
                </select>
              </div>
            </div>
          )}

          {activeType === 'water' && (
            <div className="space-y-4">
              {[
                { key: 'ducha', label: 'Minutos de ducha al día', max: 30 },
                { key: 'lavado', label: 'Lavados por semana', max: 10 },
                { key: 'jardin', label: 'Horas de riego por semana', max: 10 },
                { key: 'cocina', label: 'Horas de cocina al día', max: 8 },
              ].map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{field.label}</label>
                  <input type="range" min={0} max={field.max} value={(waterInput as any)[field.key]}
                    onChange={(e) => setWaterInput({ ...waterInput, [field.key]: Number(e.target.value) })}
                    className="w-full accent-primary-500" />
                  <span className="text-xs text-neutral-500">{(waterInput as any)[field.key]}</span>
                </div>
              ))}
            </div>
          )}

          {activeType === 'plastic' && (
            <div className="space-y-4">
              {[
                { key: 'botellas', label: 'Botellas de plástico por semana', max: 20 },
                { key: 'bolsas', label: 'Bolsas de plástico por semana', max: 20 },
                { key: 'empaques', label: 'Empaques por semana', max: 15 },
                { key: 'otros', label: 'Otros artículos por semana', max: 10 },
              ].map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{field.label}</label>
                  <input type="number" min={0} max={field.max} value={(plasticInput as any)[field.key]}
                    onChange={(e) => setPlasticInput({ ...plasticInput, [field.key]: Number(e.target.value) })}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Button onClick={handleCalculate} variant="primary">
              <Calculator size={16} />
              Calcular
            </Button>
            {result && (
              <Button onClick={handleReset} variant="outline">
                <RefreshCw size={16} />
                Reiniciar
              </Button>
            )}
          </div>
        </CardBase>

        <div>
          {result ? (
            <div className="space-y-4">
              <CardBase variant="elevated" padding="lg">
                <div className="text-center">
                  <p className="text-sm text-neutral-500">Tu {activeConfig.label} total es</p>
                  <p className="mt-1 text-4xl font-bold text-primary-600 dark:text-primary-400">
                    {result.total}
                  </p>
                  <p className="text-sm text-neutral-500">{result.unit}</p>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{result.equivalent}</p>
                </div>
              </CardBase>

              <CardBase variant="default" padding="lg">
                <h4 className="mb-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">Desglose</h4>
                <div className="space-y-3">
                  {result.breakdown.map((item) => (
                    <div key={item.category}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-neutral-700 dark:text-neutral-300">{item.category}</span>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{item.value} {item.unit}</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-700">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (item.value / result.total) * 100)}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBase>

              <CardBase variant="flat" padding="lg">
                <h4 className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">Consejos para reducir</h4>
                <ul className="space-y-2">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardBase>
            </div>
          ) : (
            <CardBase variant="flat" padding="lg">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calculator size={48} className="mb-3 text-neutral-300" />
                <p className="text-neutral-500">Completa los campos y presiona "Calcular" para ver tu huella ambiental.</p>
              </div>
            </CardBase>
          )}
        </div>
      </div>
    </div>
  );
}
