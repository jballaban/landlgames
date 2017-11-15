
export class Duration {
	public elapsed: number = 0;
	public passed: boolean = false;
	constructor(private sec: number) { }

	public update(sec: number): void {
		this.elapsed += sec;
		if (!this.passed && this.elapsed >= this.sec) {
			this.passed = true;
		}
	}

}
