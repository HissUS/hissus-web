import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
  // const [username, setUsername] = useState<string | number>("");
  // const [email, setEmail] = useState<string>("");

  // // update
  // setUsername("new name");

  // useEffect(() => {
  //   console.log("username", username);
  //   console.log("email", email);
  // }, [username]);

  //  useEffect(() => {
  //   console.log("username", username);
  //   console.log("email", email);
  // }, [email]);

  // const updateSideDrawer () => {
  //   setUsername("new name");
  //   setUsername(1);
  //   setUsername(false);
  // }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}

// <PageCard
//   title = "dfafd"
//   subtitle = "fdsafd"
//   background= "../fdsa"
//   />

//   <main className="min-h-screen">
//     <Outlet />
//   </main>
// <PageCard />
