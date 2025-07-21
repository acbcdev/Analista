export function useStorage<T>(
  key: string,
  defaultValue: T | null = null
): T | null {
  const [value, setValue] = useState<T>(defaultValue as T);
  useEffect(() => {
    const localKey: StorageItemKey = `local:${key}`;
    storage.getItem(localKey).then((res) => {
      setValue(res as T);
    });
    const unwatch = storage.watch(localKey, (newValue) => {
      setValue(newValue as T);
    });
    return () => {
      unwatch();
    };
  }, []);

  return value;
}
