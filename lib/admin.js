/**
 * The single admin account (verifies farmers on /admin/verify).
 * Keep in sync with isAdmin() in firestore.rules — the rules are what
 * actually enforce admin access; this constant only controls the UI.
 */
export const ADMIN_EMAIL = "bt.prakash@gmail.com";
