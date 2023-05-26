export default function Select({ title, value, onChange, options }: any) {
  return (
    <section className="text-center mt-4">
      <label htmlFor="select" className="mr-2 font-semibold">
        {title}:
      </label>
      <select
        className="outline-none border-2 border-black rounded bg-transparent"
        id="select"
        value={value}
        onChange={onChange}
      >
        {options.map((option: any) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </section>
  );
};
