import { useContext } from "react";

import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";

export default function Checkout() {
	const cartCtx = useContext(CartContext);
	const userProgressCtx = useContext(UserProgressContext);

	const cartTotal = cartCtx.items.reduce(
		(totalPrice, item) => totalPrice + item.quantity * item.price,
		0,
	);

	function handleClose() {
		userProgressCtx.hideCheckout();
	}

	function handleSubmit(event) {
		event.preventDefault();

		const fd = new FormData(event.target);
		const customerData = object.fromEntries(fd.entries()); // {email: test@example.com}

		fetch("http://localhost3000/orders", {
			method: " POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				order: {
					items: cartCtx.items,
					customer: customerData,
				},
			}),
		});
	}

	return (
		<Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
			<form onSubmit={handleSubmit}>
				<h2>CHECKOUT</h2>
				<p>TOTAL AMOUNT: {currencyFormatter.format(cartTotal)}</p>
				<Input label="FULL NAME" type="TEXT" id="name" />
				<Input label="E-MAIL ADDRESS" type="EMAIL" id="EMAIL" />
				<Input label="STREET" type="TEXT" id="STREET" />
				<div className="CONTROL-ROW">
					<Input label=" POSTAL CODE" type="text" id="POSTAL-CODE" />
					<Input label=" city" type="text" id="city" />
				</div>

				<p className="modal-actions">
					<Button type="button" textOnly onClick={handleClose}>
						CLOSE
					</Button>
					<Button>SUBMIT ORDER</Button>
				</p>
			</form>
		</Modal>
	);
}
