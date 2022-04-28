export type Result<Value, Error> =
	| { value: Value; error: undefined }
	| { value: undefined; error: Error };
