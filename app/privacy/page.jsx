import LegalPage from "../../components/LegalPage";

// Text lives in locales/en.json and locales/kn.json under "privacy".
const SECTIONS = [
  {
    "title": "s1Title",
    "blocks": [
      {
        "strong": "s1account"
      },
      {
        "ul": [
          "s1a1",
          "s1a2",
          "s1a3",
          "s1a4",
          "s1a5",
          "s1a6"
        ],
        "spaced": true
      },
      {
        "strong": "s1listings"
      },
      {
        "ul": [
          "s1l1",
          "s1l2",
          "s1l3",
          "s1l4",
          "s1l5"
        ],
        "spaced": true
      },
      {
        "strong": "s1transactions"
      },
      {
        "ul": [
          "s1t1",
          "s1t2",
          "s1t3"
        ]
      }
    ]
  },
  {
    "title": "s2Title",
    "blocks": [
      {
        "p": "s2p"
      },
      {
        "ul": [
          "s2i1",
          "s2i2",
          "s2i3",
          "s2i4",
          "s2i5",
          "s2i6",
          "s2i7"
        ]
      }
    ]
  },
  {
    "title": "s3Title",
    "blocks": [
      {
        "strong": "s3public"
      },
      {
        "ul": [
          "s3pu1",
          "s3pu2",
          "s3pu3",
          "s3pu4",
          "s3pu5",
          "s3pu6"
        ],
        "spaced": true
      },
      {
        "strong": "s3private"
      },
      {
        "ul": [
          "s3pr1",
          "s3pr2",
          "s3pr3"
        ],
        "spaced": true
      },
      {
        "strong": "s3third"
      },
      {
        "p": "s3thirdText"
      }
    ]
  },
  {
    "title": "s4Title",
    "blocks": [
      {
        "p": "s4p1"
      },
      {
        "ul": [
          "s4i1",
          "s4i2",
          "s4i3"
        ]
      },
      {
        "p": "s4p2"
      },
      {
        "link": "s4link",
        "prefix": "s4learnMore",
        "href": "https://firebase.google.com/support/privacy"
      }
    ]
  },
  {
    "title": "s5Title",
    "blocks": [
      {
        "p": "s5p1"
      },
      {
        "ul": [
          "s5i1",
          "s5i2",
          "s5i3",
          "s5i4"
        ]
      },
      {
        "p": "s5p2"
      }
    ]
  },
  {
    "title": "s6Title",
    "blocks": [
      {
        "p": "s6p1"
      },
      {
        "p": "s6p2"
      },
      {
        "ul": [
          "s6i1",
          "s6i2",
          "s6i3",
          "s6i4"
        ]
      }
    ]
  },
  {
    "title": "s7Title",
    "blocks": [
      {
        "p": "s7access",
        "label": "s7accessLabel"
      },
      {
        "p": "s7delete",
        "label": "s7deleteLabel"
      },
      {
        "p": "s7account",
        "label": "s7accountLabel"
      },
      {
        "p": "s7opt",
        "label": "s7optLabel"
      }
    ]
  },
  {
    "title": "s8Title",
    "blocks": [
      {
        "p": "s8p"
      }
    ]
  },
  {
    "title": "s9Title",
    "blocks": [
      {
        "p": "s9p"
      },
      {
        "ul": [
          "s9i1",
          "s9i2",
          "s9i3",
          "s9i4"
        ]
      }
    ]
  },
  {
    "title": "s10Title",
    "blocks": [
      {
        "p": "s10p"
      }
    ]
  },
  {
    "title": "s11Title",
    "blocks": [
      {
        "p": "s11p"
      },
      {
        "pStrong": "s11email"
      }
    ]
  }
];

const CALLOUT = {"title": "calloutTitle", "text": "calloutText"};

export default function PrivacyPage() {
  return <LegalPage ns="privacy" sections={SECTIONS} callout={CALLOUT} />;
}
