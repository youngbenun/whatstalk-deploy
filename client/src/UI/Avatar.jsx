export default function Avatar({ name = "", image, size = "h-10 w-10" }) {
  return image ? (
    <img src={image} alt="" className={`${size} rounded-full object-cover`} />
  ) : (
    <span
      className={`${size} grid shrink-0 place-items-center rounded-full bg-green-100 text-sm font-semibold text-brand-dark`}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}
