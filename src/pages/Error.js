import MainFooter from "../components/MainFooter/MainFooter";
import MainHeader from "../components/MainHeader/MainHeader";

function ErrorPage() {
  return (
    <>
      <MainHeader />
      <main>
        <h1>An error occured!</h1>
        <p>Could not find this page!</p>
      </main>
      <MainFooter />
    </>
  );
}
export default ErrorPage;
