export class Color {

	constructor(
		public red: number,
		public green: number,
		public blue: number
	) { }

	public toString() {
		return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
	}
}