const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "Faltan variables de entorno. Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seedFromFile(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n📂 Procesando archivo: ${fileName}`);

  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  console.log(`   Ley: "${data.titulo}" (${data.abreviatura})`);

  // Verificar si la ley ya existe (por título)
  const { data: existing } = await supabase
    .from("leyes")
    .select("id")
    .eq("titulo", data.titulo)
    .maybeSingle();

  if (existing) {
    console.log(`   ⏭️  Ya existe en la base de datos (ID: ${existing.id}). Saltando...`);
    return;
  }

  // Insertar la ley
  const { data: ley, error: leyError } = await supabase
    .from("leyes")
    .insert({
      titulo: data.titulo,
      categoria: data.categoria,
      abreviatura: data.abreviatura,
      año: data.año,
    })
    .select("id")
    .single();

  if (leyError) {
    console.error(`   ❌ Error insertando ley: ${leyError.message}`);
    return;
  }

  console.log(`   ✅ Ley insertada con ID: ${ley.id}`);

  // Insertar artículos en batches
  const articulos = data.articulos.map((art) => ({
    ley_id: ley.id,
    numero: art.numero,
    titulo: art.titulo || null,
    contenido: art.contenido,
  }));

  const BATCH_SIZE = 100;
  let insertados = 0;

  for (let i = 0; i < articulos.length; i += BATCH_SIZE) {
    const batch = articulos.slice(i, i + BATCH_SIZE);
    const { error: artError } = await supabase.from("articulos").insert(batch);

    if (artError) {
      console.error(
        `   ❌ Error insertando artículos (batch ${i / BATCH_SIZE + 1}): ${artError.message}`
      );
      return;
    }
    insertados += batch.length;
  }

  console.log(`   📝 ${insertados} artículos insertados correctamente.`);
}

async function main() {
  console.log("===========================================");
  console.log("  GLAIVE CODEX — Seed de Legislación");
  console.log("===========================================");

  const dataDir = path.resolve(__dirname, "../data");

  if (!fs.existsSync(dataDir)) {
    console.error("No se encontró la carpeta /data");
    process.exit(1);
  }

  const files = fs
    .readdirSync(dataDir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => path.join(dataDir, f));

  if (files.length === 0) {
    console.error("No se encontraron archivos JSON en /data");
    process.exit(1);
  }

  console.log(`\nEncontrados ${files.length} archivo(s) JSON en /data:\n`);
  files.forEach((f, i) => console.log(`  ${i + 1}. ${path.basename(f)}`));

  for (const file of files) {
    await seedFromFile(file);
  }

  console.log("\n===========================================");
  console.log("  Seed completado.");
  console.log("===========================================\n");
}

main();
