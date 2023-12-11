import "./App.css";
import { useEffect, useState } from "react";
import { getAllPokemon, getPokemon } from "./utils/pokemon.js";
import Card from "./components/Card/Card";
import Navbar from "./components/Navbar/Navbar";

function App() {
	const initialURL = "https://pokeapi.co/api/v2/pokemon";
	const [loading, setLoading] = useState(true);
	const [pokemonData, setPokemonData] = useState([]);
	const [prevURL, setPrevURL] = useState("");
	const [nextURL, setNextURL] = useState("");

	useEffect(() => {
		const fetchPokemonData = async () => {
			// すべてのポケモンデータを取得
			let res = await getAllPokemon(initialURL);
			// 各ポケモンの詳細なデータを取得
			loadPokemon(res.results);
			// console.log(res.next);
			setPrevURL(res.previous);
			setNextURL(res.next);
			setLoading(false);
		};

		fetchPokemonData();
	}, []);

	const loadPokemon = async (data) => {
		let _pokemonData = await Promise.all(
			data.map((pokemon) => {
				// console.log(pokemon);
				let pokemonRecord = getPokemon(pokemon.url);
				return pokemonRecord;
			})
		);

		setPokemonData(_pokemonData);
	};

	// console.log(pokemonData);

	const handlePrevPage = async () => {
		if (!prevURL) return;
		setLoading(true);
		let data = await getAllPokemon(prevURL);
		await loadPokemon(data.results);
		setPrevURL(data.previous);
		setNextURL(data.next);
		setLoading(false);
	};

	const handleNextPage = async () => {
		if (!nextURL) return;
		setLoading(true);
		let data = await getAllPokemon(nextURL);
		await loadPokemon(data.results);
		console.log(data);
		setPrevURL(data.previous);
		setNextURL(data.next);
		setLoading(false);
	};
	return (
		<>
			<Navbar />
			<div className="App">
				{loading ? (
					<h1>ロード中．．．</h1>
				) : (
					<>
						<div className="pokemonCardContainer">
							{pokemonData.map((pokemon, i) => {
								return <Card key={i} pokemon={pokemon} />;
							})}
						</div>
					</>
				)}
				<div className="btn">
					<button onClick={handlePrevPage}>前へ</button>
					<button onClick={handleNextPage}>次へ</button>
				</div>
			</div>
		</>
	);
}

export default App;
