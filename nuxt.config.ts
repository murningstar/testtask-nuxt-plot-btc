// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ["@nuxtjs/tailwindcss"],
    tailwindcss: { configPath: "tailwind.config", exposeConfig: true },

    /* Naiveui Pre-config */
    build: {
        transpile:
            process.env.NODE_ENV === "production"
                ? [
                      "naive-ui",
                      "vueuc",
                      "@css-render/vue3-ssr",
                      "@juggle/resize-observer",
                  ]
                : ["@juggle/resize-observer"],
    },
    vite: {
        optimizeDeps: {
            include:
                process.env.NODE_ENV === "development"
                    ? ["naive-ui", "vueuc", "date-fns-tz/formatInTimeZone"]
                    : [],
        },
    },
});
