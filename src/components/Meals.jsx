import React from "react";
import MealItem from "./MealItem";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {};

export default function Meals() {
	const {
		data: loadedMeals,
		isLoading,
		error,
	} = useHttp("http://localhost:3000/meals", requestConfig, []);

	if (isLoading) {
		return <p className="center">FETCHING MEALS....</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	if (error) {
		return <Error title="FAILED TO FETCH MEALS" message={error} />;
	}
	return (
		<ul id="meals">
			{loadedMeals.map((meal) => (
				<MealItem key={meal.id} meal={meal} />
			))}
		</ul>
	);
}
