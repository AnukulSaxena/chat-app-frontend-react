import { CreateForm } from "./CreateForm";


const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Chat App</h1>
        
        <CreateForm/>
      </div>
    </header>
  );
};

export default Header;
