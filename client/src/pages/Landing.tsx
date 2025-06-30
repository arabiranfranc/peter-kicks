import { Link } from "react-router-dom";
import main from "../assets/sneaker.png";

const Landing: React.FC = () => {
  return (
    <section className="w-full">
      <div className="container mx-auto min-h-[calc(100vh-var(--nav-height))] grid items-center -mt-12 lg:grid-cols-[1fr_400px] lg:gap-12 px-4">
        <div className="info">
          <h1 className="text-4xl font-bold mb-6">
            Shop Or Trade your
            <span className="text-[var(--primary-500)]">Shoes</span> App
          </h1>
          <p className="leading-8 text-[var(--text-secondary-color)] mb-6 max-w-[35em]">
            I'm baby wayfarers hoodie next level taiyaki brooklyn cliche blue
            bottle single-origin coffee chia. Aesthetic post-ironic venmo,
            quinoa lo-fi tote bag adaptogen everyday carry meggings +1 brunch
            narwhal.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="btn register-link bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="btn bg-gray-200 text-black px-4 py-3 rounded hover:bg-gray-300 transition"
            >
              Login / Demo User
            </Link>
          </div>
        </div>

        <img
          src={main}
          alt="job hunt"
          className="img main-img hidden lg:block w-full"
        />
      </div>
    </section>
  );
};

export default Landing;
