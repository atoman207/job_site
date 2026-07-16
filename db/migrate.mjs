// ============================================================================
//  マイグレーション実行スクリプト
//  db/schema.sql を Postgres（Supabase）に適用します。
//  DDL（テーブル作成）は直接 Postgres 接続が必要なため DATABASE_URL を使用します。
//  実行:  node db/migrate.mjs   (または  npm run db:migrate)
// ============================================================================
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('\n❌ DATABASE_URL が設定されていません。');
  console.error('   .env.local の DATABASE_URL に Supabase の接続文字列を設定してください。');
  console.error('   例: postgresql://postgres.<ref>:<PASSWORD>@aws-0-<region>.pooler.supabase.com:5432/postgres\n');
  process.exit(1);
}

const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf8');

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  console.log('🔌 データベースに接続しています…');
  await client.connect();
  console.log('📦 スキーマを適用しています…');
  await client.query(sql);
  console.log('✅ マイグレーション完了！テーブルを作成しました。');
} catch (err) {
  console.error('❌ マイグレーション失敗:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
