import type {
  ComponentDefinition,
  ComponentId,
  ComponentInstance,
  ComponentName,
  JsxScannerDiscovery,
} from '@coscan/jsx-scanner';

type BuiltInItem = {
  type: 'built-in';
  componentName: ComponentName;
  componentId: ComponentId;
  instances: ComponentInstance[];
};

type DefinitionItem = {
  type: 'definition';
  componentName: ComponentName;
  componentId: ComponentId;
  instances: ComponentInstance[];
} & ComponentDefinition;

type RawItem = BuiltInItem | DefinitionItem;

type CountItem = {
  componentName: ComponentName;
  componentId: ComponentId;
  instanceCount: number;
};

type JsonReport = RawItem[] | CountItem[];

export type JsonReporter = {
  type: 'json';
} & JsonReporterConfig;

export type JsonReporterConfig = {
  detail?: 'raw' | 'count';
};

export function jsonReporter(
  discoveries: JsxScannerDiscovery[],
  config: JsonReporterConfig,
): JsonReport {
  const { detail = 'raw' } = config;

  if (detail === 'raw') {
    const stash = new Map<string, RawItem>();

    discoveries.forEach((discovery) => {
      const stashedComponent = stash.get(discovery.componentId);

      if (discovery.type === 'definition') {
        if (!stashedComponent) {
          stash.set(discovery.componentId, {
            ...discovery,
            instances: [],
          });
        } else {
          stash.set(discovery.componentId, {
            ...stashedComponent,
            ...discovery,
          });
        }
      }

      if (discovery.type === 'instance') {
        if (!stashedComponent) {
          stash.set(discovery.componentId, {
            type: 'built-in',
            componentName: discovery.componentName,
            componentId: discovery.componentId,
            instances: [discovery],
          });
        } else {
          stashedComponent.instances.push(discovery);
        }
      }
    });

    return Array
      .from(stash.values())
      .sort((a, b) => b.instances.length - a.instances.length);
  }

  if (detail === 'count') {
    const stash = new Map<string, CountItem>();

    discoveries.forEach((discovery) => {
      const stashedComponent = stash.get(discovery.componentId);

      if (!stashedComponent) {
        stash.set(discovery.componentId, {
          componentName: discovery.componentName,
          componentId: discovery.componentId,
          instanceCount: discovery.type === 'instance' ? 1 : 0,
        });
      } else if (discovery.type === 'instance') {
        stashedComponent.instanceCount += 1;
      }
    });

    return Array
      .from(stash.values())
      .sort((a, b) => b.instanceCount - a.instanceCount);
  }

  return [];
}
