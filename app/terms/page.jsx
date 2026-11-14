import LegalPage from "../../components/LegalPage";

// Text lives in locales/en.json and locales/kn.json under "terms".
const SECTIONS = [
  {
    "title": "s1Title",
    "blocks": [
      {
        "p": "s1p1"
      },
      {
        "p": "s1p2"
      }
    ]
  },
  {
    "title": "s2Title",
    "blocks": [
      {
        "strong": "s2farmers"
      },
      {
        "ul": [
          "s2f1",
          "s2f2",
          "s2f3",
          "s2f4",
          "s2f5"
        ],
        "spaced": true
      },
      {
        "strong": "s2buyers"
      },
      {
        "ul": [
          "s2b1",
          "s2b2",
          "s2b3",
          "s2b4"
        ]
      }
    ]
  },
  {
    "title": "s3Title",
    "blocks": [
      {
        "p": "s3p"
      },
      {
        "ul": [
          "s3i1",
          "s3i2",
          "s3i3",
          "s3i4",
          "s3i5",
          "s3i6"
        ]
      }
    ]
  },
  {
    "title": "s4Title",
    "blocks": [
      {
        "p": "s4p"
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
          "s5i4",
          "s5i5"
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
        "p": "s6p"
      },
      {
        "ul": [
          "s6i1",
          "s6i2",
          "s6i3",
          "s6i4",
          "s6i5"
        ]
      }
    ]
  },
  {
    "title": "s7Title",
    "blocks": [
      {
        "p": "s7p"
      },
      {
        "ul": [
          "s7i1",
          "s7i2",
          "s7i3",
          "s7i4"
        ]
      }
    ]
  },
  {
    "title": "s8Title",
    "blocks": [
      {
        "p": "s8p"
      },
      {
        "ul": [
          "s8i1",
          "s8i2",
          "s8i3",
          "s8i4"
        ]
      }
    ]
  },
  {
    "title": "s9Title",
    "blocks": [
      {
        "p": "s9p"
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
  }
];

const CALLOUT = {"title": "calloutTitle", "text": "calloutText"};

export default function TermsPage() {
  return <LegalPage ns="terms" sections={SECTIONS} callout={CALLOUT} />;
}
