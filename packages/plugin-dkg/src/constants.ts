// TODO: add isConnectedTo field or similar which you will use to connect w other KAs
export const dkgMemoryTemplate = {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    "headline": "Check out this amazing project on decentralized cloud networks!",
    "articleBody": "Check out this amazing project on decentralized cloud networks! @DecentralCloud #Blockchain #Web3",
    "author": {
      "@type": "Person",
      "name": "John Doe",
      "identifier": "@JohnDoe",
      "url": "https://twitter.com/JohnDoe",
      "sameAs": [
        "https://github.com/JohnDoe",
        "https://linkedin.com/in/JohnDoe"
      ]
    },
    "datePublished": "2025-01-07T10:15:00+00:00",
    "interactionStatistic": [
      {
        "@type": "InteractionCounter",
        "interactionType": {
          "@type": "LikeAction"
        },
        "userInteractionCount": 150
      },
      {
        "@type": "InteractionCounter",
        "interactionType": {
          "@type": "ShareAction"
        },
        "userInteractionCount": 45
      }
    ],
    "mentions": [
      {
        "@type": "Person",
        "name": "Decentralized Cloud Project",
        "identifier": "@DecentralCloud",
        "url": "https://twitter.com/DecentralCloud"
      }
    ],
    "keywords": [
      "Blockchain",
      "Web3",
      "Decentralized Cloud"
    ],
    "about": [
      {
        "@type": "Thing",
        "name": "Blockchain",
        "url": "https://en.wikipedia.org/wiki/Blockchain"
      },
      {
        "@type": "Thing",
        "name": "Web3",
        "url": "https://en.wikipedia.org/wiki/Web3"
      },
      {
        "@type": "Thing",
        "name": "Decentralized Cloud",
        "url": "https://example.com/DecentralizedCloud"
      }
    ],
    "url": "https://twitter.com/JohnDoe/status/1234567890"
  }
  ;
  // associatedMedia: { can be twt image
  //   "@type": "MediaObject",
  //   contentUrl: "https://example.com/user-query-audio.mp3",
  //   encodingFormat: "audio/mpeg",
  // },

  export const sparqlExamples = [
    `
    SELECT DISTINCT ?name ?description ?contentText
    WHERE {
      ?s a <http://schema.org/CreativeWork> .
      ?s <http://schema.org/name> ?name .
      ?s <http://schema.org/description> ?description .
      ?s <http://schema.org/content> ?content .
      ?content <http://schema.org/text> ?contentText .
      FILTER(
        CONTAINS(LCASE(?description), "example_word1") ||
        CONTAINS(LCASE(?description), "example_word2")
      )
    }
    `,
    `
    SELECT DISTINCT ?name ?description ?contentText
    WHERE {
      ?s a <http://schema.org/CreativeWork> .
      ?s <http://schema.org/name> ?name .
      ?s <http://schema.org/description> ?description .
      ?s <http://schema.org/content> ?content .
      ?content <http://schema.org/text> ?contentText .
      ?s <http://schema.org/keywords> ?keyword .
      ?keyword <http://schema.org/name> ?keywordName .
      FILTER(
        CONTAINS(LCASE(?keywordName), "example_keyword1") ||
        CONTAINS(LCASE(?keywordName), "example_keyword2")
      )
    }
    `,
    `
    SELECT DISTINCT ?name ?description ?contentText
    WHERE {
      ?s a <http://schema.org/CreativeWork> .
      ?s <http://schema.org/name> ?name .
      ?s <http://schema.org/description> ?description .
      ?s <http://schema.org/content> ?content .
      ?content <http://schema.org/text> ?contentText .
      ?s <http://schema.org/about> ?about .
      ?about <http://schema.org/name> ?aboutName .
      FILTER(
        CONTAINS(LCASE(?aboutName), "example_about1") ||
        CONTAINS(LCASE(?aboutName), "example_about2")
      )
    }
    `,
  ];

  export const generalSparqlQuery = `
    SELECT DISTINCT ?name ?description ?contentText
    WHERE {
      ?s a <http://schema.org/CreativeWork> .
      ?s <http://schema.org/name> ?name .
      ?s <http://schema.org/description> ?description .
      ?s <http://schema.org/content> ?content .
      ?content <http://schema.org/text> ?contentText .
    }
    LIMIT 10
  `;

  export const DKG_EXPLORER_LINKS = {
    testnet: "https://dkg-testnet.origintrail.io/explore?ual=",
    mainnet: "https://dkg.origintrail.io/explore?ual=",
  };
