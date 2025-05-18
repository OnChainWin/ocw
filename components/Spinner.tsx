const Spinner = () => {
  return (
    <div className="flex items-center justify-center mt-10">
      <div
        className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
        role="status">
        <span className="visually-hidden font-sans">OCW</span>
      </div>
    </div>
  );
};

export default Spinner;
