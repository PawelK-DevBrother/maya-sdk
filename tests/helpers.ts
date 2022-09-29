export interface EqualTo {
    data: any;
    omit: string | string[];
}

export function expectToEqualObject(data: any, equal: EqualTo) {
    expect(omit(data, equal.omit)).toEqual(equal.data);
}

export function expectToEqual(body: any, equalTo: EqualTo) {
    expectToEqualObject(body, equalTo);

    if (typeof equalTo.omit === 'string') {
        expect(body).toHaveProperty(equalTo.omit);
    } else {
        equalTo.omit.forEach((property: string | string[]) => {
            expect(body).toHaveProperty(property);
        });
    }
}

export function omit(obj: any, props?: string[] | string) {
    const result = {...obj};
    if (!props) return result;
    if (typeof props === 'string') {
        delete result[props];
        return result;
    }
    props.forEach(function (prop) {
        delete result[prop];
    });
    return result;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
