import Logo from "../assets/logo_circle.svg";
interface HeaderProps {
  title: string;
  description?: string;
}

export const Header = ({ title, description }: HeaderProps) => {
  return (
    <header className="p-6 bg-white border-b-2">
      <div className="flex items-center justify-start gap-4">
        <img src={Logo} alt="logo" className="w-14" />
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </header>
  );
};
