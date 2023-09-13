import Image from "next/image";
import appPreviewImg from "../assets/phone-preview.png";
import logoImg from "../assets/logo.svg";
import userAvatarExempleImg from "../assets/avatares.png";
import checkIconImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {

  const [poolTitle, setPoolTitle]=useState('')


  async function createPool(event: FormEvent){
    event.preventDefault()

      try{
        const response = await api.post('/pools',{
          title: poolTitle,
        });
        const { code } = response.data
        await navigator.clipboard.writeText(code)
        alert('Bolão criando com sucesso, o código foi copiado para a área de transferência!')
        setPoolTitle('')
      }catch(err){
      console.log(err)
      alert('Falha ao criarr o bolão, tente novamente!')
    }
   
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto gap-28 grid grid-cols-2 items-center ">
      <main>
        <Image src={logoImg} alt="logo NLWCopa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={userAvatarExempleImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-green-500">
              +{props.userCount} pessoas já estão usando
            </span>
          </strong>
        </div>
        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="qual é o nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            className="bg-yellow-500 px-6 py-4 text-gray-900 font-bold uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>
        <p className="mt-4 text-sm  text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas!
        </p>
        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={checkIconImg} alt="check icon" />
            <div className="flex flex-col">
              <span className="font-bold font-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={checkIconImg} alt="check icon" />
            <div className="flex flex-col">
              <span className="font-bold font-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div> 
        </div>
      </main>
      <Image
        src={appPreviewImg}
        alt="pre visialização do aplicativo em dois telefones"
        quality={100}
      />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [PoolCountResponse, GuessCountResponse, userCountResponse] = await Promise.all([
    api.get("pools/count"),
    api.get("guesses/count"),
    api.get("users/count")
  ])

  return {
    props: {
      poolCount: PoolCountResponse.data.count,
      guessCount: GuessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  }; 
};
 
// getStaticProps - implementar 