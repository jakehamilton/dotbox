import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";

import Parser from "../parser";

const simple = fs.readFileSync(
	path.resolve(__dirname, "examples", "simple.box"),
	{ encoding: "utf-8" }
);

describe("Compiler", () => {
	it("should compile", () => {
		const parser = new Parser();

		const output = parser.parse(simple);

		expect(output).toMatchInlineSnapshot(`
          {
            "attrs": {
              "loc": {
                "end": {
                  "col": 0,
                  "line": 3,
                },
                "start": {
                  "col": 0,
                  "line": 2,
                },
              },
              "type": "Attrs",
              "value": [
                {
                  "loc": {
                    "end": {
                      "col": 0,
                      "line": 2,
                    },
                    "start": {
                      "col": 0,
                      "line": 2,
                    },
                  },
                  "name": {
                    "loc": {
                      "end": {
                        "col": 0,
                        "line": 2,
                      },
                      "start": {
                        "col": 0,
                        "line": 2,
                      },
                    },
                    "type": "Identifier",
                    "value": "a",
                    "whitespace": {
                      "loc": {
                        "end": {
                          "col": 0,
                          "line": 2,
                        },
                        "start": {
                          "col": 1,
                          "line": 1,
                        },
                      },
                      "type": "Whitespace",
                      "value": "
          ",
                    },
                  },
                  "value": {
                    "loc": {
                      "end": {
                        "col": 0,
                        "line": 2,
                      },
                      "start": {
                        "col": 0,
                        "line": 2,
                      },
                    },
                    "type": "Attrs",
                    "value": [
                      {
                        "loc": {
                          "end": {
                            "col": 0,
                            "line": 2,
                          },
                          "start": {
                            "col": 0,
                            "line": 2,
                          },
                        },
                        "name": {
                          "loc": {
                            "end": {
                              "col": 0,
                              "line": 2,
                            },
                            "start": {
                              "col": 0,
                              "line": 2,
                            },
                          },
                          "type": "Identifier",
                          "value": "x",
                          "whitespace": {
                            "loc": {
                              "end": {
                                "col": 0,
                                "line": 2,
                              },
                              "start": {
                                "col": 0,
                                "line": 2,
                              },
                            },
                            "type": "Whitespace",
                            "value": " ",
                          },
                        },
                        "value": {
                          "kind": 3,
                          "loc": {
                            "end": {
                              "col": 0,
                              "line": 2,
                            },
                            "start": {
                              "col": 0,
                              "line": 2,
                            },
                          },
                          "type": "Number",
                          "value": "4",
                          "whitespace": {
                            "loc": {
                              "end": {
                                "col": 0,
                                "line": 2,
                              },
                              "start": {
                                "col": 0,
                                "line": 2,
                              },
                            },
                            "type": "Whitespace",
                            "value": " ",
                          },
                        },
                      },
                      {
                        "loc": {
                          "end": {
                            "col": 0,
                            "line": 2,
                          },
                          "start": {
                            "col": 0,
                            "line": 2,
                          },
                        },
                        "name": {
                          "loc": {
                            "end": {
                              "col": 0,
                              "line": 2,
                            },
                            "start": {
                              "col": 0,
                              "line": 2,
                            },
                          },
                          "type": "Identifier",
                          "value": "y",
                          "whitespace": {
                            "loc": {
                              "end": {
                                "col": 0,
                                "line": 2,
                              },
                              "start": {
                                "col": 0,
                                "line": 2,
                              },
                            },
                            "type": "Whitespace",
                            "value": " ",
                          },
                        },
                        "value": {
                          "loc": {
                            "end": {
                              "col": 0,
                              "line": 2,
                            },
                            "start": {
                              "col": 0,
                              "line": 2,
                            },
                          },
                          "type": "List",
                          "value": [
                            {
                              "kind": 3,
                              "loc": {
                                "end": {
                                  "col": 0,
                                  "line": 2,
                                },
                                "start": {
                                  "col": 0,
                                  "line": 2,
                                },
                              },
                              "type": "Number",
                              "value": "1",
                              "whitespace": {
                                "loc": {
                                  "end": {
                                    "col": 0,
                                    "line": 2,
                                  },
                                  "start": {
                                    "col": 0,
                                    "line": 2,
                                  },
                                },
                                "type": "Whitespace",
                                "value": " ",
                              },
                            },
                            {
                              "kind": 3,
                              "loc": {
                                "end": {
                                  "col": 0,
                                  "line": 2,
                                },
                                "start": {
                                  "col": 0,
                                  "line": 2,
                                },
                              },
                              "type": "Number",
                              "value": "2",
                              "whitespace": {
                                "loc": {
                                  "end": {
                                    "col": 0,
                                    "line": 2,
                                  },
                                  "start": {
                                    "col": 0,
                                    "line": 2,
                                  },
                                },
                                "type": "Whitespace",
                                "value": " ",
                              },
                            },
                            {
                              "kind": 3,
                              "loc": {
                                "end": {
                                  "col": 0,
                                  "line": 2,
                                },
                                "start": {
                                  "col": 0,
                                  "line": 2,
                                },
                              },
                              "type": "Number",
                              "value": "3",
                              "whitespace": {
                                "loc": {
                                  "end": {
                                    "col": 0,
                                    "line": 2,
                                  },
                                  "start": {
                                    "col": 0,
                                    "line": 2,
                                  },
                                },
                                "type": "Whitespace",
                                "value": " ",
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
            "missing": [],
          }
        `);
	});
});
