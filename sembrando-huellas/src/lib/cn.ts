import clsx from 'clsx';

type ClassValue = string | number | boolean | null | undefined | ClassValue[];

export const cn = (...inputs: ClassValue[]): string => clsx(inputs);
