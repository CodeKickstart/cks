// vite.config.ts
import { defineConfig } from "file:///Users/bd/Documents/__DEV_4/_DEV/cks-interview/Configurator/cfgui/node_modules/vite/dist/node/index.js";
import react from "file:///Users/bd/Documents/__DEV_4/_DEV/cks-interview/Configurator/cfgui/node_modules/@vitejs/plugin-react/dist/index.mjs";
var CLIENT_ORIGIN = 3502;
var vite_config_default = defineConfig({
  server: {
    port: CLIENT_ORIGIN,
    proxy: {
      "/api": "http://localhost:4002"
    }
  },
  plugins: [react()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYmQvRG9jdW1lbnRzL19fREVWXzQvX0RFVi9ja3MtaW50ZXJ2aWV3L0NvbmZpZ3VyYXRvci9jZmd1aVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2JkL0RvY3VtZW50cy9fX0RFVl80L19ERVYvY2tzLWludGVydmlldy9Db25maWd1cmF0b3IvY2ZndWkvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2JkL0RvY3VtZW50cy9fX0RFVl80L19ERVYvY2tzLWludGVydmlldy9Db25maWd1cmF0b3IvY2ZndWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuXG5jb25zdCBDTElFTlRfT1JJR0lOID0gMzUwMjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogQ0xJRU5UX09SSUdJTixcbiAgICBwcm94eToge1xuICAgICAgXCIvYXBpXCI6IFwiaHR0cDovL2xvY2FsaG9zdDo0MDAyXCIsXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW3JlYWN0KCldLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFYLFNBQVMsb0JBQW9CO0FBQ2xaLE9BQU8sV0FBVztBQUVsQixJQUFNLGdCQUFnQjtBQUV0QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFDbkIsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
