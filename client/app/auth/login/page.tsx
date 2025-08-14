// Replace your current login page with:
import LoginForm from "../../../components/Auth.LoginForm";
import OAuthButtons from "../../../components/Auth.OAuthButtons";

export default function LoginPage() {
  return (
    <main className="container-responsive">
      <div className="content-container">
        <header className="spacing-sm text-center">
          <h1 className="text-brand-dark">Sign in to DocuFam</h1>
          <p className="text-brand-dark-grey">Secure family document vault</p>
        </header>

        <OAuthButtons />

        <div className="flex items-center spacing-sm">
          <div className="h-px flex-1 bg-brand-light-med" />
          <span className="text-brand-mid text-sm">or</span>
          <div className="h-px flex-1 bg-brand-light-med" />
        </div>

        <LoginForm />

        <p className="text-center text-brand-dark-grey">
          Don't have an account?{" "}
          <a className="link-underlined" href="/auth/register">
            Create one here
          </a>
        </p>
      </div>
    </main>
  );
}
