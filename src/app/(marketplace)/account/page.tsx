import { AccountSections } from "@/features/account/account-sections";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Akun Saya</h1>
        <p className="text-sm text-muted-foreground">Kelola profil, pesanan, dan pengaturan akun Anda</p>
      </div>

      <AccountSections />
    </div>
  );
}
