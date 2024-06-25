declare module "*.json" {
  interface PackageJson {
    name: string;
    version: string;
  }
  const value: PackageJson;
  export default value;
}
