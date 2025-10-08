const BASE_URL = "https://fakestoreapi.com";

// Colores ANSI (no requiere dependencias)
const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
};

async function apiFetch(method, path, body) {
    const opts = {
        method,
        headers: { "Content-Type": "application/json" },
    };
    if (body !== undefined) opts.body = JSON.stringify(body);

    const res = await fetch(`${BASE_URL}${path}`, opts);
    if (!res.ok) {
        // Captura error genérico si no existe el producto
        if (res.status === 404) {
            throw new Error(`No encontrado (HTTP 404!!!)`);
        }

        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} → ${text || "(sin cuerpo)"}`);
    }
    return res.json();
}

// --- Parsing de CLI ---
/*
    Formatos esperados:
    npm run start GET products
    npm run start GET products/<id>
    npm run start POST products <title> <price> <category>
    npm run start DELETE products/<id>

    Notas:
    - <title> puede llevar guiones (p.ej. T-Shirt-Rex). Los guiones se transforman en espacios para consola.
    - <category> puede tener espacios si la pasás entre comillas: "ropa hombre"
*/

const [, , rawMethod, ...rest] = process.argv;

function printHelp() {
    console.log(`
        ${colors.yellow}Uso:${colors.reset}
            npm run start GET products
            npm run start GET products/<id>
            npm run start POST products <title> <price> <category>
            npm run start DELETE products/<id>

        ${colors.yellow}Ejemplos:${colors.reset}
            npm run start GET products
            npm run start GET products/15
            npm run start POST products T-Shirt-Rex 300 remeras
            npm run start POST products "T Rex Deluxe" 300 "ropa hombre"
            npm run start DELETE products/7
    `);
}

function parsePathAndArgs(restArgs) {
    // Esperamos algo como: ["products"] o ["products/15"] o ["products", ...payload]
    if (restArgs.length === 0) return { path: null, payload: [] };
    const [first, ...payload] = restArgs;
    return { path: first, payload };
}

(async () => {
    try {
        const method = (rawMethod || "").toUpperCase();
        const { path, payload } = parsePathAndArgs(rest);

        if (!["GET", "POST", "DELETE"].includes(method) || !path) {
            printHelp();
            process.exitCode = 1;
            return;
        }

        // Ramas por método
        if (method === "GET") {
            // GET products  |  GET products/<id>
            if (path === "products") {
                console.log(`${colors.blue}📦 Obteniendo lista completa de productos...${colors.reset}`);
                const data = await apiFetch("GET", "/products");
                // Mostrar una tabla en consola
                console.table(
                    data.map(p => ({
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        category: p.category,
                    }))
                );
                return;
            }

        if (path.startsWith("products/")) {
            const id = path.split("/")[1];
            if (!id) throw new Error("Falta <productId>.");
                console.log(`${colors.blue}🔍 Consultando producto con id=${id}...${colors.reset}`);

                try {
                    const prod = await apiFetch("GET", `/products/${id}`);
                    if (!prod || Object.keys(prod).length === 0) {
                        console.log(`${colors.red}❌ El producto con id=${id} no existe.${colors.reset}`);
                        return;
                    }
                    console.log(`${colors.green}✅ Producto encontrado:${colors.reset}`);
                    console.log(JSON.stringify(prod, null, 2));
                    return;
                } catch (err) {
                    console.log(`${colors.red}❌ El producto con id=${id} no existe.${colors.reset}`);
                }
                return;
        }

        throw new Error(`Ruta no soportada para GET: ${path}`);
        }

        if (method === "POST") {
          // POST products <title> <price> <category>
            if (path !== "products") {
                throw new Error(`Ruta no soportada para POST: ${path}`);
            }

            if (payload.length < 3) {
                throw new Error(
                "POST products requiere: <title> <price> <category>\nEj: npm run start POST products T-Shirt-Rex 300 remeras"
                );
            }

            // title puede venir con guiones: T-Shirt-Rex → "T Shirt Rex" para mostrar lindo
            const [rawTitle, rawPrice, ...rawCategoryParts] = payload;
            const title = rawTitle.replace(/-/g, " ");
            const price = Number(rawPrice);
            const category = rawCategoryParts.join(" ").trim();

            if (Number.isNaN(price)) {
                throw new Error(`El precio debe ser numérico. Recibido: ${rawPrice}`);
            }
            if (!category) {
                throw new Error("Falta la categoría (puede ir entre comillas si tiene espacios).");
            }

            const body = { title, price, category };
            console.log(`${colors.blue}🆕 Creando producto...${colors.reset}`);

            const created = await apiFetch("POST", "/products", body);
            console.log(`${colors.green}✅ Producto creado:${colors.reset}`);
            console.log(JSON.stringify(created, null, 2));
            return;
        }

        if (method === "DELETE") {
            // DELETE products/<id>
            if (!path.startsWith("products/")) {
                throw new Error(`Ruta no soportada para DELETE: ${path}`);
            }
            const id = path.split("/")[1];
            if (!id) throw new Error("Falta <productId>.");

            console.log(`${colors.blue}🗑️ Eliminando producto con id=${id}...${colors.reset}`);
            try {
                const deleted = await apiFetch("DELETE", `/products/${id}`);
                if (!deleted || Object.keys(deleted).length === 0) {
                    console.log(`${colors.red}❌ El producto con id=${id} no existe.${colors.reset}`);
                    return;
                }
                console.log(`${colors.green}✅ Producto eliminado correctamente:${colors.reset}`);
                console.log(JSON.stringify(deleted, null, 2));
            } catch (err) {
                console.log(`${colors.red}❌ El producto con id=${id} no existe.${colors.reset}`);
            }
            return;
        }

            // Si cae aquí, algo no matcheó:
            printHelp();
            process.exitCode = 1;
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exitCode = 1;
    }
})();