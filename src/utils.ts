export class GraphQlCustomError extends Error {
    message: string;
    statusCode: number;
    query: string;
    variables: any;
    constructor(obj: {message: string; statusCode: number; query: string; variables: any}) {
        super();
        this.message = obj.message;
        this.statusCode = obj.statusCode;
        this.query = obj.query;
        this.variables = obj.variables;
    }
}
