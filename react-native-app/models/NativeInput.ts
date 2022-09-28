export type NativeInput = {
    ACTION?: 'START_SNITCH' | 'DID_SNITCH',
    META_DATA?: string
}

export function getMetaData(input: NativeInput) {
    return input.META_DATA ? JSON.parse(input.META_DATA) : null;
}