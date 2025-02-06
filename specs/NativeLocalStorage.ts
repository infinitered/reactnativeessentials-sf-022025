import { TurboModule, TurboModuleRegistry } from 'react-native'

export interface Spec extends TurboModule {
  setItem(value: string, key: string): void
  getItem(key: string): string | null
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeLocalStorage')
