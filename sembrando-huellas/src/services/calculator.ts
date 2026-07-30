import api from '@/lib/axios';
import type { APIResponse } from '@/types';

export interface CalculatorFootprint {
  category: string;
  value: number;
  unit: string;
  color: string;
}

export interface CalculatorResult {
  total: number;
  unit: string;
  breakdown: CalculatorFootprint[];
  equivalent: string;
  tips: string[];
}

export type CalculatorType = 'carbon' | 'water' | 'plastic';

interface CalculatorInput {
  carbon: {
    transporte: string;
    electricidad: number;
    alimentacion: string;
    residuos: string;
  };
  water: {
    ducha: number;
    lavado: number;
    jardin: number;
    cocina: number;
  };
  plastic: {
    botellas: number;
    bolsas: number;
    empaques: number;
    otros: number;
  };
}

const EMISSION_FACTORS = {
  carbon: {
    transporte: { publico: 0.5, privado: 2.3, moto: 1.1, bici: 0, ninguno: 0 },
    electricidad: 0.45,
    alimentacion: { vegano: 1.5, vegetariano: 2.0, mixta: 3.5, carnivoro: 5.0 },
    residuos: { minimo: 0.2, moderado: 0.6, alto: 1.2 },
  },
};

export class CalculatorService {
  static calculate(input: CalculatorInput[CalculatorType], type: CalculatorType): CalculatorResult {
    switch (type) {
      case 'carbon':
        return this.calculateCarbon(input as CalculatorInput['carbon']);
      case 'water':
        return this.calculateWater(input as CalculatorInput['water']);
      case 'plastic':
        return this.calculatePlastic(input as CalculatorInput['plastic']);
    }
  }

  private static calculateCarbon(input: CalculatorInput['carbon']): CalculatorResult {
    const transporte = EMISSION_FACTORS.carbon.transporte[input.transporte as keyof typeof EMISSION_FACTORS.carbon.transporte] || 0;
    const electricidad = input.electricidad * EMISSION_FACTORS.carbon.electricidad;
    const alimentacion = EMISSION_FACTORS.carbon.alimentacion[input.alimentacion as keyof typeof EMISSION_FACTORS.carbon.alimentacion] || 0;
    const residuos = EMISSION_FACTORS.carbon.residuos[input.residuos as keyof typeof EMISSION_FACTORS.carbon.residuos] || 0;
    const total = transporte + electricidad + alimentacion + residuos;

    return {
      total: Math.round(total * 100) / 100,
      unit: 'tCO2e/año',
      breakdown: [
        { category: 'Transporte', value: transporte, unit: 'tCO2e/año', color: '#3B82F6' },
        { category: 'Electricidad', value: electricidad, unit: 'tCO2e/año', color: '#10B981' },
        { category: 'Alimentación', value: alimentacion, unit: 'tCO2e/año', color: '#F59E0B' },
        { category: 'Residuos', value: residuos, unit: 'tCO2e/año', color: '#EF4444' },
      ],
      equivalent: total > 4 ? 'Superas el promedio global. Revisa nuestros consejos.' : 'Estás por debajo del promedio global. ¡Sigue así!',
      tips: [
        'Usa transporte público o bicicleta',
        'Cambia a focos LED y electrodomésticos eficientes',
        'Reduce el consumo de carne roja',
        'Separa y recicla tus residuos',
      ],
    };
  }

  private static calculateWater(input: CalculatorInput['water']): CalculatorResult {
    const ducha = input.ducha * 10;
    const lavado = input.lavado * 15;
    const jardin = input.jardin * 20;
    const cocina = input.cocina * 8;
    const total = ducha + lavado + jardin + cocina;

    return {
      total,
      unit: 'L/día',
      breakdown: [
        { category: 'Ducha', value: ducha, unit: 'L/día', color: '#3B82F6' },
        { category: 'Lavado', value: lavado, unit: 'L/día', color: '#10B981' },
        { category: 'Jardín', value: jardin, unit: 'L/día', color: '#F59E0B' },
        { category: 'Cocina', value: cocina, unit: 'L/día', color: '#8B5CF6' },
      ],
      equivalent: total > 200 ? 'Consumo alto. Revisa formas de reducir.' : 'Consumo moderado.',
      tips: [
        'Reduce el tiempo de ducha a 5 minutos',
        'Reutiliza el agua de lavado para el jardín',
        'Repara fugas inmediatamente',
        'Usa regadera en vez de manguera',
      ],
    };
  }

  private static calculatePlastic(input: CalculatorInput['plastic']): CalculatorResult {
    const total = input.botellas + input.bolsas * 0.5 + input.empaques * 0.3 + input.otros * 0.8;

    return {
      total: Math.round(total * 100) / 100,
      unit: 'kg/semana',
      breakdown: [
        { category: 'Botellas', value: input.botellas, unit: 'kg/semana', color: '#3B82F6' },
        { category: 'Bolsas', value: input.bolsas * 0.5, unit: 'kg/semana', color: '#10B981' },
        { category: 'Empaques', value: input.empaques * 0.3, unit: 'kg/semana', color: '#F59E0B' },
        { category: 'Otros', value: input.otros * 0.8, unit: 'kg/semana', color: '#EF4444' },
      ],
      equivalent: total > 2 ? 'Consumo alto de plástico.' : 'Buen manejo de plástico.',
      tips: [
        'Usa botellas reutilizables',
        'Lleva bolsas de tela al supermercado',
        'Evita productos con empaques innecesarios',
        'Compra a granel cuando sea posible',
      ],
    };
  }

  static async apiCalculate(type: CalculatorType, input: unknown): Promise<APIResponse<CalculatorResult>> {
    const { data } = await api.post<APIResponse<CalculatorResult>>(`/calculator/${type}`, input);
    return data;
  }
}
