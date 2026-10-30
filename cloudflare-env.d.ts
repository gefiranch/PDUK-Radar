declare namespace Cloudflare {
  interface Env {
    PDUK_TEST_ADMIN_PASSWORD?: string;
    PDUK_TEST_USER_PASSWORD?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
