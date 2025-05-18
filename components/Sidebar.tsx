import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const Sidebar = (props: Props) => {
  return (
    <div className="flex flex-col sticky top-24 h-[80vh]">
      <div className="flex-1 border-2 flex flex-col inset-x-0 max-h-[100vh] min-h-3xl rounded-[35px] dark:bg-black bg-white space-x-1 w-[76px] py-1 mt-[10vh]">
        <ul className="flex flex-col justify-between gap-12 sm:gap-16 my-auto items-center">
          <li>
            <Link
              href={"/play"}
              className="flex gap-2 hover:scale-125 ease-in-out hover:duration-300 hover:opacity-90 group relative justify-center rounded ">
              <svg
                className="w-7 h-7 flex justify-center text-center"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 48 48">
                <path fill="#E8EAF6" d="M42 39L6 39 6 23 24 6 42 23z"></path>
                <path
                  fill="#C5CAE9"
                  d="M39 21L34 16 34 9 39 9zM6 39H42V44H6z"></path>
                <path
                  fill="#B71C1C"
                  d="M24 4.3L4 22.9 6 25.1 24 8.4 42 25.1 44 22.9z"></path>
                <path fill="#D84315" d="M18 28H30V44H18z"></path>
                <path fill="#01579B" d="M21 17H27V23H21z"></path>
                <path
                  fill="#FF8A65"
                  d="M27.5,35.5c-0.3,0-0.5,0.2-0.5,0.5v2c0,0.3,0.2,0.5,0.5,0.5S28,38.3,28,38v-2C28,35.7,27.8,35.5,27.5,35.5z"></path>
              </svg>
              {/* <HomeIcon className="w-7 h-7 flex justify-center text-center" /> */}
              <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded dark:bg-white bg-black px-2 py-1.5 text-xs font-medium text-white dark:text-black group-hover:visible">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link
              href={"/ocw"}
              className="flex gap-2 hover:scale-125 ease-in-out hover:duration-300 hover:opacity-90 group relative justify-center rounded ">
              <svg
                className="w-7 h-7 flex justify-center text-center"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 48 48">
                <linearGradient
                  id="CGL_GKCxzpeCV1FOHEsfja_tKi3GV0RURly_gr1"
                  x1="15"
                  x2="15"
                  y1="31"
                  y2="41"
                  gradientUnits="userSpaceOnUse"></linearGradient>
                <path
                  fill="url(#CGL_GKCxzpeCV1FOHEsfja_tKi3GV0RURly_gr1)"
                  d="M13,37.9V32c0-0.6-0.4-1-1-1s-1,0.4-1,1v5.9c0,1.9,1.2,3.1,3,3.1v-2C13.5,39,13,38.9,13,37.9z M18,37.9V32c0-0.6-0.4-1-1-1s-1,0.4-1,1v5.9c0,1.9,1.2,3.1,3,3.1v-2C18.5,39,18,38.9,18,37.9z"></path>
                <linearGradient
                  id="CGL_GKCxzpeCV1FOHEsfjb_tKi3GV0RURly_gr2"
                  x1="29"
                  x2="29"
                  y1="31"
                  y2="41"
                  gradientUnits="userSpaceOnUse"></linearGradient>
                <path
                  fill="url(#CGL_GKCxzpeCV1FOHEsfjb_tKi3GV0RURly_gr2)"
                  d="M27,37.9V32c0-0.6-0.4-1-1-1s-1,0.4-1,1v5.9c0,1.9,1.2,3.1,3,3.1v-2C27.5,39,27,38.9,27,37.9z M32,37.9V32c0-0.6-0.4-1-1-1s-1,0.4-1,1v5.9c0,1.9,1.2,3.1,3,3.1v-2C32.5,39,32,38.9,32,37.9z"></path>
                <path fill="#54daff" d="M45,18L31,7l-2.544,7.556L45,18z"></path>
                <path
                  fill="#35c1f1"
                  d="M31,7L6,14l-2,6l24.456-5.444L31,7z"></path>
                <path
                  fill="#33afec"
                  d="M45,18l-16.544-3.444l1.475,10.9L45,18z"></path>
                <linearGradient
                  id="CGL_GKCxzpeCV1FOHEsfjc_tKi3GV0RURly_gr3"
                  x1="16.965"
                  x2="16.965"
                  y1="14.556"
                  y2="27"
                  gradientUnits="userSpaceOnUse"></linearGradient>
                <path
                  fill="url(#CGL_GKCxzpeCV1FOHEsfjc_tKi3GV0RURly_gr3)"
                  d="M4,20l24.456-5.444l1.475,10.9L5,27L4,20z"></path>
                <path
                  fill="#027ad4"
                  d="M45,18l-15.069,7.456L35,32L45,18z"></path>
                <path
                  fill="#0553a4"
                  d="M5,27l24.931-1.544L35,32H9L5,27z"></path>
                <rect width="2" height=".5" x="11" y="32" opacity=".07"></rect>
                <rect width="2" height=".5" x="16" y="32" opacity=".07"></rect>
                <rect width="2" height=".5" x="25" y="32" opacity=".07"></rect>
                <rect width="2" height=".5" x="30" y="32" opacity=".07"></rect>
                <rect
                  width="2"
                  height=".5"
                  x="11"
                  y="32.5"
                  opacity=".05"></rect>
                <rect
                  width="2"
                  height=".5"
                  x="16"
                  y="32.5"
                  opacity=".05"></rect>
                <rect
                  width="2"
                  height=".5"
                  x="25"
                  y="32.5"
                  opacity=".05"></rect>
                <rect
                  width="2"
                  height=".5"
                  x="30"
                  y="32.5"
                  opacity=".05"></rect>
              </svg>
              {/* <SwatchBook className="w-7 h-7 flex justify-center text-center" /> */}
              <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded dark:bg-white bg-black px-2 py-1.5 text-xs font-medium text-white dark:text-black group-hover:visible">
                Raffle 1
              </span>
            </Link>
          </li>

          <li>
            <Link
              href={"/freeocw"}
              className="flex gap-2 hover:scale-125 ease-in-out hover:duration-300 hover:opacity-90 group relative justify-center rounded ">
              <svg
                className="w-7 h-7 flex justify-center text-center"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 48 48">
                <path
                  fill="#212121"
                  d="M24,5C13.5,5,5,13.5,5,24s8.5,19,19,19s19-8.5,19-19S34.5,5,24,5z M24,31c-3.9,0-7-3.1-7-7s3.1-7,7-7 s7,3.1,7,7S27.9,31,24,31z"></path>
                <path
                  fill="#64ffda"
                  d="M24,44C13,44,4,35,4,24C4,13,13,4,24,4c11,0,20,9,20,20C44,35,35,44,24,44z M24,6 C14.1,6,6,14.1,6,24c0,9.9,8.1,18,18,18c9.9,0,18-8.1,18-18C42,14.1,33.9,6,24,6z"></path>
                <path
                  fill="#64ffda"
                  d="M24 36c-6.6 0-12-5.4-12-12 0-5.3 3.6-10.1 8.7-11.5.5-.2 1.1.2 1.2.7.2.5-.2 1.1-.7 1.2C17 15.6 14 19.5 14 24c0 5.5 4.5 10 10 10 5.5 0 10-4.5 10-10 0-4.5-3-8.4-7.3-9.6-.5-.2-.8-.7-.7-1.2.1-.5.7-.8 1.2-.7C32.4 13.9 36 18.7 36 24 36 30.6 30.6 36 24 36zM19 6v3.9c-.7.2-1.4.5-2 .9V6H19zM19 38.1V42h-2v-4.7C17.6 37.6 18.3 37.9 19 38.1zM31 6v4.7c-.6-.3-1.3-.6-2-.9V6H31zM31 37.3V42h-2v-3.9C29.7 37.9 30.4 37.6 31 37.3z"></path>
              </svg>
              {/* <Projector className="w-7 h-7 flex justify-center text-center" /> */}
              <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded dark:bg-white bg-black px-2 py-1.5 text-xs font-medium text-white dark:text-black group-hover:visible">
                Raffle 2
              </span>
            </Link>
          </li>

          <li>
            <Link
              href={"/freeocw3"}
              className="flex gap-2 hover:scale-125 ease-in-out hover:duration-300 hover:opacity-90 group relative justify-center rounded ">
              <svg
                className="w-7 h-7 flex justify-center text-center"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 100 100">
                <path
                  d="M77,95.5c-11.304,0-20.5-9.196-20.5-20.5c0-1.653,0.195-3.278,0.583-4.86L49.944,63h-5.646 C40.59,68.862,34.116,72.5,27,72.5C15.696,72.5,6.5,63.304,6.5,52S15.696,31.5,27,31.5c7.116,0,13.59,3.638,17.299,9.5h5.646 l7.139-7.14C56.695,32.278,56.5,30.653,56.5,29c0-11.304,9.196-20.5,20.5-20.5S97.5,17.696,97.5,29S88.304,49.5,77,49.5 c-1.363,0-2.715-0.135-4.041-0.403L70.056,52l2.903,2.903C74.285,54.635,75.637,54.5,77,54.5c11.304,0,20.5,9.196,20.5,20.5 S88.304,95.5,77,95.5z"
                  opacity=".35"></path>
                <path
                  fill="#f2f2f2"
                  d="M75,93.5c-11.304,0-20.5-9.196-20.5-20.5c0-1.653,0.195-3.278,0.583-4.86L47.944,61h-5.646 C38.59,66.862,32.116,70.5,25,70.5C13.696,70.5,4.5,61.304,4.5,50S13.696,29.5,25,29.5c7.116,0,13.59,3.638,17.299,9.5h5.646 l7.139-7.14C54.695,30.278,54.5,28.653,54.5,27c0-11.304,9.196-20.5,20.5-20.5S95.5,15.696,95.5,27S86.304,47.5,75,47.5 c-1.363,0-2.715-0.135-4.041-0.403L68.056,50l2.903,2.903C72.285,52.635,73.637,52.5,75,52.5c11.304,0,20.5,9.196,20.5,20.5 S86.304,93.5,75,93.5z"></path>
                <rect
                  width="24.096"
                  height="7.489"
                  x="33.904"
                  y="46.255"
                  fill="#707cc0"></rect>
                <rect
                  width="24.096"
                  height="7.489"
                  x="48.569"
                  y="37.83"
                  fill="#707cc0"
                  transform="rotate(-42.791 60.62 41.577)"></rect>
                <rect
                  width="7.489"
                  height="24.096"
                  x="55.851"
                  y="45.14"
                  fill="#707cc0"
                  transform="rotate(-42.791 59.6 57.19)"></rect>
                <circle
                  cx="24.753"
                  cy="49.875"
                  r="12.753"
                  fill="#70bfff"></circle>
                <circle
                  cx="75.226"
                  cy="27.029"
                  r="12.753"
                  fill="#70bfff"></circle>
                <circle
                  cx="75.098"
                  cy="73.194"
                  r="12.753"
                  fill="#70bfff"></circle>
                <path
                  fill="#40396e"
                  d="M75,14.5c7.361,0,13.236,6.362,12.425,13.888c-0.602,5.586-5.014,10.17-10.574,10.978 c-2.656,0.386-5.172-0.076-7.34-1.141c-0.393-0.193-0.861-0.133-1.17,0.177L57.449,49.293c-0.391,0.391-0.391,1.024,0,1.414 l10.891,10.892c0.309,0.309,0.778,0.37,1.17,0.177c2.168-1.065,4.685-1.527,7.341-1.141c5.493,0.798,9.88,5.282,10.552,10.792 c0.993,8.141-5.847,14.977-13.989,13.976c-5.624-0.691-10.15-5.251-10.823-10.877c-0.333-2.785,0.262-5.407,1.502-7.618 c0.224-0.4,0.175-0.896-0.149-1.22L51.551,53.293C51.363,53.105,51.109,53,50.844,53l-12.967,0c-0.447,0-0.825,0.301-0.958,0.727 c-1.714,5.489-7.097,9.357-13.286,8.7c-5.746-0.61-10.415-5.253-11.053-10.995C11.742,43.887,17.625,37.5,25,37.5 c5.603,0,10.332,3.691,11.919,8.771C37.052,46.698,37.431,47,37.879,47h12.965c0.265,0,0.52-0.105,0.707-0.293l12.395-12.395 c0.324-0.324,0.373-0.819,0.149-1.218C63.083,31.291,62.5,29.215,62.5,27C62.5,20.096,68.096,14.5,75,14.5 M75,11.5 c-8.547,0-15.5,6.953-15.5,15.5c0,2.149,0.446,4.259,1.304,6.211L50.015,44H39.283c-2.378-5.695-7.954-9.5-14.283-9.5 c-8.547,0-15.5,6.953-15.5,15.5S16.453,65.5,25,65.5c6.328,0,11.904-3.805,14.283-9.5h10.732l10.789,10.789 C59.946,68.741,59.5,70.851,59.5,73c0,8.547,6.953,15.5,15.5,15.5S90.5,81.547,90.5,73S83.547,57.5,75,57.5 c-1.881,0-3.748,0.347-5.501,1.014L60.985,50l8.514-8.514C71.252,42.153,73.119,42.5,75,42.5c8.547,0,15.5-6.953,15.5-15.5 S83.547,11.5,75,11.5L75,11.5z"></path>
              </svg>
              {/* <SidebarIcon className="w-7 h-7 flex justify-center text-center" /> */}
              <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded dark:bg-white bg-black px-2 py-1.5 text-xs font-medium text-white dark:text-black group-hover:visible">
                Raffle 3
              </span>
            </Link>
          </li>

          <li>
            <Link
              href={"/tokenocw"}
              className="flex gap-2 hover:scale-125 ease-in-out hover:duration-300 hover:opacity-90 group relative justify-center rounded ">
              <svg
                className="w-7 h-7 flex justify-center text-center"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 100 100">
                <path
                  fill="#f1bc19"
                  d="M78 13A1 1 0 1 0 78 15A1 1 0 1 0 78 13Z"></path>
                <path
                  fill="#f9dbd2"
                  d="M50 12A38 38 0 1 0 50 88A38 38 0 1 0 50 12Z"></path>
                <path
                  fill="#f1bc19"
                  d="M84 12A4 4 0 1 0 84 20A4 4 0 1 0 84 12Z"></path>
                <path
                  fill="#ee3e54"
                  d="M14 24A2 2 0 1 0 14 28A2 2 0 1 0 14 24Z"></path>
                <path
                  fill="#fbcd59"
                  d="M78 75A2 2 0 1 0 78 79 2 2 0 1 0 78 75zM17 74A4 4 0 1 0 17 82 4 4 0 1 0 17 74z"></path>
                <path
                  fill="#ee3e54"
                  d="M24 81A2 2 0 1 0 24 85A2 2 0 1 0 24 81Z"></path>
                <path
                  fill="#fff"
                  d="M66.483 76.03399999999999A2.483 2.483 0 1 0 66.483 81 2.483 2.483 0 1 0 66.483 76.03399999999999zM16 47A1 1 0 1 0 16 49 1 1 0 1 0 16 47z"></path>
                <path
                  fill="#f1bc19"
                  d="M86 30A1 1 0 1 0 86 32A1 1 0 1 0 86 30Z"></path>
                <path
                  fill="#fff"
                  d="M80 64A2 2 0 1 0 80 68A2 2 0 1 0 80 64Z"></path>
                <g>
                  <path
                    fill="#fde751"
                    d="M50,25.625c-13.393,0-24.25,10.857-24.25,24.25c0,13.393,10.857,24.25,24.25,24.25 s24.25-10.857,24.25-24.25C74.25,36.482,63.393,25.625,50,25.625z M50,69.875c-11.046,0-20-8.954-20-20s8.954-20,20-20 s20,8.954,20,20S61.046,69.875,50,69.875z"></path>
                </g>
                <g>
                  <path
                    fill="#472b29"
                    d="M50,74.825c-13.757,0-24.95-11.192-24.95-24.95S36.243,24.925,50,24.925 c13.758,0,24.95,11.192,24.95,24.95S63.758,74.825,50,74.825z M50,26.325c-12.985,0-23.55,10.564-23.55,23.55 S37.015,73.425,50,73.425s23.55-10.564,23.55-23.55S62.985,26.325,50,26.325z"></path>
                </g>
                <g>
                  <path
                    fill="#472b29"
                    d="M69.424,44.625c-0.214,0-0.412-0.138-0.478-0.353c-0.089-0.288-0.184-0.572-0.284-0.854 c-0.39-1.089-0.885-2.155-1.47-3.169c-0.139-0.239-0.057-0.545,0.183-0.683c0.239-0.14,0.543-0.058,0.683,0.183 c0.616,1.065,1.136,2.187,1.546,3.331c0.106,0.297,0.205,0.595,0.298,0.896c0.082,0.265-0.066,0.544-0.33,0.625 C69.522,44.618,69.473,44.625,69.424,44.625z"></path>
                </g>
                <g>
                  <path
                    fill="#472b29"
                    d="M50,70.75c-11.511,0-20.875-9.337-20.875-20.813S38.489,29.125,50,29.125 c5.975,0,11.674,2.56,15.636,7.023c0.3,0.337,0.588,0.685,0.865,1.041c0.17,0.218,0.131,0.531-0.088,0.701 c-0.217,0.169-0.532,0.131-0.701-0.088c-0.264-0.339-0.538-0.669-0.823-0.99c-3.773-4.25-9.199-6.688-14.889-6.688 c-10.959,0-19.875,8.888-19.875,19.813S39.041,69.75,50,69.75s19.875-8.888,19.875-19.813c0-0.992-0.074-1.992-0.222-2.973 c-0.041-0.273,0.146-0.527,0.42-0.568c0.271-0.034,0.527,0.146,0.568,0.42c0.155,1.029,0.233,2.079,0.233,3.121 C70.875,61.413,61.511,70.75,50,70.75z"></path>
                </g>
              </svg>
              {/* <AxeIcon className="w-7 h-7 flex justify-center text-center" /> */}
              <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded dark:bg-white bg-black px-2 py-1.5 text-xs font-medium text-white dark:text-black group-hover:visible">
                Raffle 4
              </span>
            </Link>
          </li>

          <li>
            <Link
              href={"/raffleguide"}
              target="_blank"
              className="flex gap-2 hover:scale-125 ease-in-out hover:duration-300 hover:opacity-90 group relative justify-center rounded ">
              <svg
                className="w-7 h-7 flex justify-center text-center"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 100 100">
                <path
                  fill="#78a0cf"
                  d="M13 27A2 2 0 1 0 13 31A2 2 0 1 0 13 27Z"></path>
                <path
                  fill="#f1bc19"
                  d="M77 12A1 1 0 1 0 77 14A1 1 0 1 0 77 12Z"></path>
                <path
                  fill="#cee1f4"
                  d="M50 13A37 37 0 1 0 50 87A37 37 0 1 0 50 13Z"></path>
                <path
                  fill="#f1bc19"
                  d="M83 11A4 4 0 1 0 83 19A4 4 0 1 0 83 11Z"></path>
                <path
                  fill="#78a0cf"
                  d="M87 22A2 2 0 1 0 87 26A2 2 0 1 0 87 22Z"></path>
                <path
                  fill="#fbcd59"
                  d="M81 74A2 2 0 1 0 81 78 2 2 0 1 0 81 74zM15 59A4 4 0 1 0 15 67 4 4 0 1 0 15 59z"></path>
                <path
                  fill="#78a0cf"
                  d="M25 85A2 2 0 1 0 25 89A2 2 0 1 0 25 85Z"></path>
                <path
                  fill="#fff"
                  d="M18.5 51A2.5 2.5 0 1 0 18.5 56A2.5 2.5 0 1 0 18.5 51Z"></path>
                <path
                  fill="#f1bc19"
                  d="M21 66A1 1 0 1 0 21 68A1 1 0 1 0 21 66Z"></path>
                <path
                  fill="#fff"
                  d="M80 33A1 1 0 1 0 80 35A1 1 0 1 0 80 33Z"></path>
                <path
                  fill="#ef9922"
                  d="M35,72.3c-4.025,0-7.3-3.274-7.3-7.3V35c0-4.025,3.274-7.3,7.3-7.3h30c4.025,0,7.3,3.274,7.3,7.3 v30c0,4.025-3.274,7.3-7.3,7.3H35z"></path>
                <path
                  fill="#472b29"
                  d="M65,28.4c3.639,0,6.6,2.961,6.6,6.6v30c0,3.639-2.961,6.6-6.6,6.6H35c-3.639,0-6.6-2.961-6.6-6.6 V35c0-3.639,2.961-6.6,6.6-6.6H65 M65,27H35c-4.4,0-8,3.6-8,8v30c0,4.4,3.6,8,8,8h30c4.4,0,8-3.6,8-8V35C73,30.6,69.4,27,65,27 L65,27z"></path>
                <path
                  fill="#472b29"
                  d="M68.5,47.375c-0.276,0-0.5-0.224-0.5-0.5V43c0-0.276,0.224-0.5,0.5-0.5S69,42.724,69,43v3.875 C69,47.151,68.776,47.375,68.5,47.375z"></path>
                <g>
                  <path
                    fill="#472b29"
                    d="M68.5,40.5c-0.276,0-0.5-0.224-0.5-0.5v-2c0-0.276,0.224-0.5,0.5-0.5S69,37.724,69,38v2 C69,40.276,68.776,40.5,68.5,40.5z"></path>
                </g>
                <g>
                  <path
                    fill="#472b29"
                    d="M64,69H36c-2.757,0-5-2.243-5-5V36c0-2.757,2.243-5,5-5h25.375c0.276,0,0.5,0.224,0.5,0.5 s-0.224,0.5-0.5,0.5H36c-2.206,0-4,1.794-4,4v28c0,2.206,1.794,4,4,4h28c2.206,0,4-1.794,4-4V49.625c0-0.276,0.224-0.5,0.5-0.5 s0.5,0.224,0.5,0.5V64C69,66.757,66.757,69,64,69z"></path>
                </g>
                <g>
                  <path
                    fill="#fdfcef"
                    d="M34.791,47.61c-0.003,3.157,1.946,6.144,5.297,8.117l0,0c0,1.705-0.497,3.593-1.118,4.795 c-0.217,0.42,0.14,0.923,0.61,0.87c3.089-0.342,6.015-1.867,7.571-3.392h1.766c7.802,0,14.126-4.652,14.126-10.39 s-6.324-10.39-14.126-10.39S34.791,41.872,34.791,47.61"></path>
                  <path
                    fill="#472b29"
                    d="M39.515,61.896c-0.362,0-0.704-0.18-0.914-0.485c-0.23-0.335-0.259-0.765-0.075-1.119 c0.5-0.968,1.004-2.64,1.057-4.285c-3.371-2.074-5.295-5.121-5.292-8.396c0-6.005,6.561-10.891,14.626-10.891 s14.626,4.886,14.626,10.891S56.982,58.5,48.917,58.5h-1.566c-1.567,1.456-4.503,3.034-7.716,3.39 C39.595,61.894,39.555,61.896,39.515,61.896z M48.917,37.72c-7.513,0-13.626,4.437-13.626,9.891l0,0 c-0.003,2.993,1.838,5.794,5.05,7.686l0.247,0.145v0.286c0,1.673-0.46,3.645-1.173,5.024c0.022,0.111,0.058,0.143,0.111,0.145 c3.081-0.341,5.874-1.879,7.275-3.253l0.146-0.143h1.97c7.513,0,13.626-4.437,13.626-9.89C62.543,42.156,56.43,37.72,48.917,37.72z"></path>
                </g>
                <g>
                  <path
                    fill="#ee3e54"
                    d="M56.5 50A5.5 5.5 0 1 0 56.5 61A5.5 5.5 0 1 0 56.5 50Z"></path>
                  <path
                    fill="#472b29"
                    d="M56.5,61.5c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S59.809,61.5,56.5,61.5z M56.5,50.5 c-2.757,0-5,2.243-5,5s2.243,5,5,5s5-2.243,5-5S59.257,50.5,56.5,50.5z"></path>
                </g>
                <g>
                  <path
                    fill="#fdfcef"
                    d="M59.141 56.085c-.25-.248-.549-.374-.89-.374-.346 0-.647.126-.896.375-.25.249-.376.551-.376.896 0 .342.123.641.37.89.247.249.55.375.902.375.349 0 .649-.127.895-.377.247-.25.37-.549.37-.888C59.515 56.637 59.39 56.337 59.141 56.085zM58.709 56.983c0 .125-.045.23-.136.322-.184.186-.474.179-.651 0-.091-.093-.136-.198-.136-.322 0-.128.046-.235.138-.328.09-.091.198-.137.327-.137.123 0 .23.046.321.137C58.664 56.747 58.709 56.855 58.709 56.983zM56.13 54.097c0-.349-.126-.649-.376-.897-.25-.247-.55-.371-.895-.371-.344 0-.643.125-.891.371-.249.248-.375.55-.375.897 0 .342.123.642.37.891.247.251.549.377.896.377.351 0 .654-.126.901-.377C56.007 54.738 56.13 54.438 56.13 54.097zM55.323 54.097c0 .127-.045.233-.135.326-.182.181-.466.185-.653 0-.091-.093-.136-.199-.136-.326 0-.128.045-.235.135-.327.091-.09.198-.135.325-.135.128 0 .235.045.328.135C55.279 53.862 55.323 53.968 55.323 54.097z"></path>
                  <path
                    fill="#fdfcef"
                    d="M58.634,52.883c-0.021-0.034-0.058-0.056-0.098-0.056h-2.018c-0.064,0-0.114,0.05-0.114,0.114 v0.579c0,0.064,0.05,0.114,0.114,0.114h0.958l-2.501,4.445c-0.021,0.034-0.021,0.078,0.001,0.114 c0.021,0.034,0.058,0.056,0.098,0.056h0.579c0.041,0,0.079-0.023,0.101-0.058l2.882-5.193 C58.655,52.962,58.655,52.918,58.634,52.883z"></path>
                </g>
                <g>
                  <path
                    fill="#472b29"
                    d="M49.5,43.75h-9c-0.138,0-0.25-0.112-0.25-0.25s0.112-0.25,0.25-0.25h9c0.138,0,0.25,0.112,0.25,0.25 S49.638,43.75,49.5,43.75z"></path>
                </g>
                <g>
                  <path
                    fill="#472b29"
                    d="M44.5,46.75h-6c-0.138,0-0.25-0.112-0.25-0.25s0.112-0.25,0.25-0.25h6c0.138,0,0.25,0.112,0.25,0.25 S44.638,46.75,44.5,46.75z"></path>
                </g>
                <g>
                  <path
                    fill="#472b29"
                    d="M57.5,46.75h-11c-0.138,0-0.25-0.112-0.25-0.25s0.112-0.25,0.25-0.25h11 c0.138,0,0.25,0.112,0.25,0.25S57.638,46.75,57.5,46.75z"></path>
                </g>
                <g>
                  <path
                    fill="#472b29"
                    d="M55.5,43.75h-4c-0.138,0-0.25-0.112-0.25-0.25s0.112-0.25,0.25-0.25h4c0.138,0,0.25,0.112,0.25,0.25 S55.638,43.75,55.5,43.75z"></path>
                </g>
                <g>
                  <path
                    fill="#472b29"
                    d="M48.5,52.75h-7c-0.138,0-0.25-0.112-0.25-0.25s0.112-0.25,0.25-0.25h7c0.138,0,0.25,0.112,0.25,0.25 S48.638,52.75,48.5,52.75z"></path>
                </g>
                <g>
                  <path
                    fill="#472b29"
                    d="M50.5,49.75h-11c-0.138,0-0.25-0.112-0.25-0.25s0.112-0.25,0.25-0.25h11 c0.138,0,0.25,0.112,0.25,0.25S50.638,49.75,50.5,49.75z"></path>
                </g>
              </svg>

              <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded dark:bg-white bg-black px-2 py-1.5 text-xs font-medium text-white dark:text-black group-hover:visible">
                Raffle Guide
              </span>
            </Link>
          </li>

          {/* <li>
            <Link
              href={"/demo"}
              className="flex gap-2 hover:scale-125 ease-in-out hover:duration-300 hover:opacity-90 group relative justify-center rounded ">
              <svg
                className="w-7 h-7 flex justify-center text-center"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 48 48">
                <path
                  fill="#8bc34a"
                  d="M44,7L4,23l40,16l-7-16L44,7z M36,23H17l18-7l1,6V23z"></path>
                <path
                  fill="#1b5e20"
                  d="M40.212,10.669l-5.044,11.529L34.817,23l0.351,0.802l5.044,11.529L9.385,23L40.212,10.669 M44,7L4,23 l40,16l-7-16L44,7L44,7z"></path>
                <path
                  fill="#1b5e20"
                  d="M36,22l-1-6l-18,7l17,7l-2-5l-8-2h12V22z M27.661,21l5.771-2.244L33.806,21H27.661z"></path>
              </svg>
              <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded dark:bg-white bg-black px-2 py-1.5 text-xs font-medium text-white dark:text-black group-hover:visible">
                Demo
              </span>
            </Link>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
