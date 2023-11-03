import { useContext } from "react";

import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";

const requestConfig = {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
};

export default function Checkout() {
	const cartCtx = useContext(CartContext);
	const userProgressCtx = useContext(UserProgressContext);

	const {
		data,
		isLoading: isSending,
		error,
		sendRequest,
		clearData,
	} = useHttp("http://localhost:3000/orders", requestConfig);

	const cartTotal = cartCtx.items.reduce(
		(totalPrice, item) => totalPrice + item.quantity * item.price,
		0,
	);

	function handleClose() {
		userProgressCtx.hideCheckout();
	}

	function handleFinish() {
		userProgressCtx.ctx.hideCheckout();
		cartCtx.clearCart();
		clearData();
	}

	function handleSubmit(event) {
		event.preventDefault();

		const fd = new FormData(event.target);
		const customerData = object.fromEntries(fd.entries()); // {email: test@example.com}

		sendRequest(
			JSON.stringify({
				order: {
					items: cartCtx.items,
					customer: customerData,
				},
			}),
		);
	}

	let actions = (
		<>
			<Button type="button" textOnly onClick={handleClose}>
				CLOSE
			</Button>
			<Button>SUBMIT ORDER</Button>
		</>
	);

	if (isSending) {
		actions = <span>SENDING ORDER DATA...</span>;
	}

	if (data && !error) {
		return (
			<Modal
				open={userProgressCtx.progress === "checkout"}
				onClose={handleFinish}
			>
				<h2>SUCCESS!</h2>
				<p>YOUR ORDER WAS SUBMITTED SUCCESSFULLY.</p>
				<p>
					WE WILL GET BACK TO YOU WITH MORE DETAIL VIA EMAIL WITHIN THE NEXT FEW
					MINUTES.
				</p>
				<p className="modal-actions">
					<Button onClick={handleFinish}>OKAY</Button>
				</p>
			</Modal>
		);
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
				{error && <Error title="FAILED TO SUBMIT ORDER" message={error} />}
				<p className="modal-actions">{actions}</p>
			</form>
		</Modal>
	);
}
