/**
 * Sample content + default BG for each LY recipe.
 * Used by layouts gallery and the add-slide picker.
 */

export const LAYOUT_SAMPLES = {
        "LY-01": {
          bg: "BG-01",
          content: {
            headline: "Identity threats start in the collection phase",
            accent: "collection phase",
            subtitle:
              "Proactive defense for credentials and identity assets — before the breach.",
          },
        },
        "LY-02": {
          bg: "BG-08",
          content: {
            sectionTitle: "Leadership",
            title: "The people behind CyberArmor",
            subtitle: "The team building prebreach defense.",
            people: [
              {
                name: "Nguyen Nguyen",
                role: "CEO",
                avatar: "/visual%20assets/avatars/avatar-nguyen-circle.png",
              },
              {
                name: "Ali Alame",
                role: "CTO",
                avatar: "/visual%20assets/avatars/avatar-ali-circle.png",
              },
              {
                name: "Meganne Ohata",
                role: "CXO",
                avatar: "/visual%20assets/avatars/avatar-meganne-circle.png",
              },
            ],
          },
        },
        "LY-03": {
          bg: "BG-02",
          content: {
            sectionTitle: "Roadmap",
            title: "What we’ll cover",
            subtitle: "Three phases of the identity threat lifecycle.",
            items: [
              {
                number: "01",
                title: "Collection",
                description:
                  "Where credentials and identity assets are harvested before breach disclosure.",
              },
              {
                number: "02",
                title: "Delivery",
                description:
                  "How clean reputation and trusted tooling help attacks bypass controls.",
              },
              {
                number: "03",
                title: "Detection",
                description:
                  "How prebreach signals become earlier defensive action.",
              },
            ],
          },
        },
        "LY-04": {
          bg: "BG-03",
          content: {
            number: "01",
            sectionTitle: "Collection",
            subtitle:
              "Before the breach, attackers assemble identity assets in the open.",
          },
        },
        "LY-05": {
          bg: "BG-02",
          content: {
            text: "Instead of focusing primarily on public breaches or broad threat analytics, we monitor the collection phase, where credentials and identity assets are actively being harvested",
            accent:
              "we monitor the collection phase, where credentials and identity assets are actively being harvested",
          },
        },
        "LY-06": {
          bg: "BG-03",
          content: {
            number: "02",
            sectionTitle: "Delivery",
            title: "SEGs miss expired clean domains",
            subtitle: "Reputation alone is not a defense.",
            text: "Legacy secure email gateways (SEGs) rely on reputation scoring. When an attacker buys a recently expired domain that historically had a “clean” reputation, it glides right past your filters.",
            shots: [
              {
                src: "/visual%20assets/screenshots/Purchase%20of%20recently%20expired%2C%20clean%20domains.png",
                alt: "Expired domain purchase",
              },
              {
                src: "/visual%20assets/screenshots/Using%20bitcoin%20to%20pay%20for%20expired%20domains.png",
                alt: "Crypto payment",
              },
            ],
          },
        },
        "LY-07": {
          bg: "BG-05",
          content: {
            number: "02",
            sectionTitle: "Delivery",
            title: "Evidence leads the story",
            subtitle: "Screenshots first, insight second.",
            text: "Same content structure as LY-06, mirrored — screenshots on the left, insight copy on the right.",
            shots: [
              {
                src: "/visual%20assets/screenshots/Purchase%20of%20recently%20expired%2C%20clean%20domains.png",
                alt: "Expired domain purchase",
              },
              {
                src: "/visual%20assets/screenshots/Using%20bitcoin%20to%20pay%20for%20expired%20domains.png",
                alt: "Crypto payment",
              },
            ],
          },
        },
        "LY-08": {
          bg: "BG-06",
          content: {
            number: "03",
            sectionTitle: "Detection",
            title: "Turn collection signals into action",
            subtitle: "From early exposure to focused response.",
            text: "Early identity signals give defenders context before compromised credentials become a disclosed incident.",
            bullets: [
              "See credential harvesting as it happens",
              "Prioritize identities by exposure and intent",
              "Act before attackers operationalize access",
            ],
          },
        },
        "LY-09": {
          bg: "BG-09",
          content: {
            number: "03",
            sectionTitle: "Detection",
            title: "From signal to defense",
            subtitle: "A three-step loop for turning exposure into action.",
            steps: [
              {
                title: "Observe",
                icon: "ph-eye",
                description:
                  "Monitor where credentials and identity assets are actively collected.",
              },
              {
                title: "Correlate",
                icon: "ph-graph",
                description:
                  "Connect exposed identities to attacker infrastructure and intent.",
              },
              {
                title: "Defend",
                icon: "ph-shield-check",
                description:
                  "Trigger focused action before access becomes a breach.",
              },
            ],
          },
        },
        "LY-10": {
          bg: "BG-12",
          content: {
            number: "03",
            sectionTitle: "Detection",
            title: "The prebreach workflow",
            subtitle: "How CyberArmor moves from raw signal to focused response.",
            steps: [
              {
                title: "Collect",
                icon: "ph-download-simple",
                description: "Capture active credential-harvesting signals.",
              },
              {
                title: "Enrich",
                icon: "ph-circles-three-plus",
                description:
                  "Add identity, infrastructure, and campaign context.",
              },
              {
                title: "Prioritize",
                icon: "ph-ranking",
                description:
                  "Surface the exposures with the highest operational risk.",
              },
              {
                title: "Respond",
                icon: "ph-lightning",
                description:
                  "Take focused action before attackers gain access.",
              },
            ],
          },
        },
        "LY-11": {
          bg: "BG-01",
          content: {
            number: "03",
            sectionTitle: "Detection",
            title: "The scale of the threat",
            subtitle: "Credential theft is accelerating.",
            metric: {
              value: "+160%",
              text: "Increase of credential theft due to AI powered phishing and malware-as-a-service",
              source: "ITPro",
            },
          },
        },
        "LY-12": {
          bg: "BG-04",
          content: {
            number: "03",
            sectionTitle: "Detection",
            title: "Signals that matter",
            subtitle: "A few numbers that frame the problem.",
            metrics: [
              {
                value: "+160%",
                text: "Increase in credential theft from AI-powered phishing and malware-as-a-service",
                source: "ITPro",
              },
              {
                value: "80%",
                text: "Of breaches involve compromised or stolen credentials",
                source: "Verizon DBIR",
              },
              {
                value: "24h",
                text: "Median time from credential exposure to attempted reuse",
                source: "CyberArmor",
              },
            ],
          },
        },
        "LY-13": {
          bg: "BG-02",
          content: {
            number: "03",
            sectionTitle: "Detection",
            question: "What is malware?",
          },
        },
        "LY-14": {
          bg: "BG-05",
          content: {
            number: "03",
            sectionTitle: "Detection",
            question: "What is malware?",
            subtitle: "(Spoiler alert: It’s bad news)",
          },
        },
        "LY-15": {
          bg: "BG-01",
          content: {
            number: "02",
            sectionTitle: "Delivery",
            title: "Trusted tools, hijacked",
            subtitle: "Legitimate remote access software used as the payload.",
            image:
              "/visual%20assets/screenshots/Phish%20campaign%20impersonnating%20SSA%20which%20installs%20remotePC%2C%20a%20legit%20remote%20access%20tool.%20Once%20an%20attacker%20has%20remote%20access%20to%20a%20machine%2C%20they%20can%20access%20files%2C%20monitor%20activity%2C%20and%20collect%20credentials.%20And%20because%20RemotePC%20is%20legitimate%20software%2C%20i.png?v=27",
            alt: "Remote access phishing campaign evidence",
          },
        },
        "LY-16": {
          bg: "BG-03",
          content: {
            number: "02",
            sectionTitle: "Delivery",
            title: "Phishing kits for sale",
            subtitle: "Commodity platforms make session theft turnkey.",
            bullets: [
              "Ready-made phishing pages and token capture",
              "Session replay that bypasses MFA",
              "Priced for volume — free tiers included",
            ],
            image:
              "/visual%20assets/screenshots/kali365%20product%20marketing%20using%20tokenvault%20-%20top%20of%20the%20page.png?v=27",
            alt: "Kali365 TokenVault product marketing",
          },
        },
        "LY-17": {
          bg: "BG-06",
          content: {
            number: "01",
            sectionTitle: "Collection",
            title: "Infostealers hide in plain sight",
            subtitle: "Piracy tutorials that deliver credential theft.",
            image:
              "/visual%20assets/screenshots/Youtube%20channel%20that%20teaches%20how%20to%20install%20windows%20illegally%20using%20license%20activator%20%28KMS%29%2C%20which%20actually%20downloads%20an%20infostealer%20that%20steals%20credentials%20and%20takes%20screenshots.png?v=27",
            alt: "YouTube channel promoting malicious activators",
          },
        },
        "LY-18": {
          bg: "BG-09",
          content: {
            number: "03",
            sectionTitle: "Detection",
            title: "The prebreach workflow",
            subtitle: "How CyberArmor moves from raw signal to focused response.",
            startNumber: 1,
            steps: [
              {
                title: "Collect",
                description:
                  "Capture active credential-harvesting signals across the collection surface.",
              },
            ],
          },
        },
        "LY-19": {
          bg: "BG-12",
          content: {
            number: "03",
            sectionTitle: "Detection",
            startNumber: 2,
            steps: [
              {
                title: "Enrich",
                description:
                  "Add identity, infrastructure, and campaign context to each signal.",
              },
              {
                title: "Prioritize",
                description:
                  "Surface the exposures with the highest operational risk.",
              },
              {
                title: "Correlate",
                description:
                  "Connect identities to attacker infrastructure and intent.",
              },
            ],
          },
        },
        "LY-20": {
          bg: "BG-04",
          content: {
            number: "03",
            sectionTitle: "Detection",
            startNumber: 5,
            closing: "From signal to action — before the breach.",
            steps: [
              {
                title: "Respond",
                description:
                  "Take focused action before attackers gain durable access.",
              },
              {
                title: "Verify",
                description:
                  "Confirm remediation and close the loop on exposed identities.",
              },
            ],
          },
        },
      };
