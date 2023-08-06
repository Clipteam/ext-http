import { api, type, Extension } from 'clipcc-extension';

type BlockArgs = Record<string, unknown>;

class HTTP extends Extension {
    private headers = new Headers();
    constructor () {
        super();
        this.headers.set('Content-Type', 'application/json');
        this.headers.set('Accept', 'application/json');
    }

    async onInit () {
        await api.addCategory({
            categoryId: 'shiki.http.category',
            messageId: 'shiki.http.category',
            color: '#434C56'
        });
        await api.addBlocks([{
            opcode: 'shiki.http.get',
            type: type.BlockType.REPORTER,
            messageId: 'shiki.http.get',
            categoryId: 'shiki.http.category',
            param: {
                URL: {
                    type: type.ParameterType.STRING,
                    default: 'https://test.com/'
                }
            },
            function: async (args: BlockArgs) => {
                if (!args.URL) throw 'URL is missing';

                const res = await fetch(
                    String(args.URL),
                    {headers: this.headers}
                );
                return JSON.stringify({
                    status: res.status,
                    body: await res.text()
                });
            }
        }, {
            opcode: 'shiki.http.send',
            type: type.BlockType.REPORTER,
            messageId: 'shiki.http.send',
            categoryId: 'shiki.http.category',
            param: {
                OPTION: {
                    type: type.ParameterType.STRING,
                    default: 'POST',
                    menu: [{
                        messageId: 'shiki.http.post',
                        value: 'POST'
                    }, {
                        messageId: 'shiki.http.put',
                        value: 'PUT'
                    }, {
                        messageId: 'shiki.http.delete',
                        value: 'DELETE'
                    }, {
                        messageId: 'shiki.http.connect',
                        value: 'CONNECT'
                    }, {
                        messageId: 'shiki.http.option',
                        value: 'OPTION'
                    }, {
                        messageId: 'shiki.http.patch',
                        value: 'PATCH'
                    }]
                },
                BODY: {
                    type: type.ParameterType.STRING,
                    default: '{"key": "value"}'
                },
                URL: {
                    type: type.ParameterType.STRING,
                    default: 'https://test.com/'
                }
            },
            function: async (args: BlockArgs) => {
                if (!args.URL) throw 'URL is missing';

                const res = await fetch(
                    String(args.URL),
                    {
                        method: String(args.OPTION),
                        body: String(args.BODY),
                        headers: this.headers
                    }
                );
                return JSON.stringify({
                    status: res.status,
                    body: await res.text()
                });
            }
        }, {
            opcode: 'shiki.http.getHeader',
            type: type.BlockType.REPORTER,
            messageId: 'shiki.http.getHeader',
            categoryId: 'shiki.http.category',
            param: {
                KEY: {
                    type: type.ParameterType.STRING,
                    default: 'ACCEPT'
                }
            },
            function: (args: BlockArgs) => (
                this.headers.get(String(args.KEY)) ?? ''
            )
        }, {
            opcode: 'shiki.http.deleteHeader',
            type: type.BlockType.COMMAND,
            messageId: 'shiki.http.deleteHeader',
            categoryId: 'shiki.http.category',
            param: {
                KEY: {
                    type: type.ParameterType.STRING,
                    default: 'ACCEPT'
                }
            },
            function: (args: BlockArgs) => {
                this.headers.delete(String(args.KEY));
            }
        }, {
            opcode: 'shiki.http.setHeader',
            type: type.BlockType.COMMAND,
            messageId: 'shiki.http.setHeader',
            categoryId: 'shiki.http.category',
            param: {
                KEY: {
                    type: type.ParameterType.STRING,
                    default: 'ACCEPT'
                },
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: 'application/json'
                }
            },
            function: (args: BlockArgs) => {
                this.headers.set(String(args.KEY), String(args.VALUE));
            }
        }]);
    }
}

export default HTTP;
