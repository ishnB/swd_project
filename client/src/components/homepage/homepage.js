import { React } from "react";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const history = useNavigate();
  return (
    <div>
      <h1 className="mb-4 text-3xl font-extrabold drop-shadow-2xl leading-none tracking-tight font-pop text-purple-900 md:text-4xl lg:text-5xl dark:text-purple my-6">
        WELCOME
      </h1>
      <div class="homepage py-12 flex flex-row justify-center space-x-4">
        <button
          onClick={() => {
            history("/vendorlogin");
          }}
          class="bg-purple border-2 transition-colors hover:bg-white hover:text-purple hover:border-2 hover:border-purple text-white font-bold py-2 px-4 rounded"
        >
          VENDORS
        </button>

        <button
          onClick={() => {
            history("/studentlogin");
          }}
          class="bg-purple border-2 transition-colors hover:bg-white hover:text-purple hover:border-2 hover:border-purple text-white font-bold py-2 px-4 rounded"
        >
          STUDENTS
        </button>
      </div>
    </div>
  );
}

export default Homepage;
