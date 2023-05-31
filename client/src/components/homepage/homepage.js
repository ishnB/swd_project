import { React } from "react";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const history = useNavigate();
  return (
    <div class="homepage py-12 flex flex-row justify-center space-x-4">
      <button
        onClick={() => {
          history("/vendorlogin");
        }}
        class="bg-purple border-2 hover:bg-white hover:text-purple hover:border-2 hover:border-purple text-white font-bold py-2 px-4 rounded"
      >
        VENDORS
      </button>

      <button
        onClick={() => {
          history("/studentlogin");
        }}
        class="bg-purple border-2 hover:bg-white hover:text-purple hover:border-2 hover:border-purple text-white font-bold py-2 px-4 rounded"
      >
        STUDENTS
      </button>
    </div>
  );
}

export default Homepage;
