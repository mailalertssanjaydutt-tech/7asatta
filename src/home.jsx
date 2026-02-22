import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import FAQ from "./assets/components/faq";
import Readmore from "./assets/components/Readmore";
import Clock from "./pages/clock";
import api from "./utils/api";
import LiveGameResult from "./pages/LiveGameResult";
import GroupTable from "./pages/GroupTable";
import MonthlyGroupTable from "./pages/MonthlyGroupTable";
import CustomAds from "./pages/CustomAds";
import BottomAds from "./pages/BottomPromotion";

import Luckynumber from "./assets/components/Luckynumber";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();
	  const currentYear = new Date().getFullYear();
  const startYear = 2025;

  // Fetch games from backend
  useEffect(() => {
    let cancelled = false;
    const fetchGames = async () => {
      try {
        const res = await api.get("/games");
        if (cancelled) return;
        setGames(res.data);
        console.log("Fetched games:", res.data);
        if (res.data.length > 0) setSelectedGame(res.data[0].name);
      } catch (err) {
        console.error("Failed to fetch games:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchGames();
    return () => {
      cancelled = true;
    };
  }, []);

const handleCheck = () => {
  if (!selectedGame || !selectedYear) return;

  const gameSlug = selectedGame
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

navigate(`/chart-${selectedYear}/${gameSlug}-satta-king-result`);
};

const UpcomingResults = ({ loadingInitial }) => {
  const [cards, setCards] = useState(
    new Array(3).fill(null).map(() => ({
      name: "",
      resultTime: "--",
      latestResult: null,
      minutesUntil: null,
      loading: true
    }))
  );

  const mountedRef = useRef(false);
  const intervalRef = useRef(null);
  const controllerRef = useRef(null);

  // Convert "18:30" -> "6:30 PM"
  const to12Hour = (timeStr) => {
    if (!timeStr || timeStr === "--") return "--";
    const [h, m] = timeStr.split(":");
    let hour = parseInt(h, 10);
    const minutes = parseInt(m, 10);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;

    return `${hour}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const fetchOnce = async () => {
    try {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();

      const r = await api.get("/upcoming?limit=5", {
        signal: controllerRef.current.signal
      });

      const data = r.data;
      if (!mountedRef.current) return;

      if (Array.isArray(data.cards)) {
        const mapped = data.cards.map((c) => ({
          name: c.name || "—",
          resultTime: c.resultTime ? to12Hour(c.resultTime) : "--",
          latestResult: c.latestResult ?? null,
          minutesUntil: c.minutesUntil ?? null,
          loading: false
        }));

        while (mapped.length < 3)
          mapped.push({
            name: "--",
            resultTime: "--",
            latestResult: null,
            minutesUntil: null,
            loading: false
          });

        setCards(mapped.slice(0, 3));
      } else {
        setCards(
          new Array(3).fill(null).map(() => ({
            name: "--",
            resultTime: "--",
            latestResult: null,
            minutesUntil: null,
            loading: false
          }))
        );
      }
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        console.warn("Upcoming fetch failed", err);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchOnce();
    intervalRef.current = setInterval(fetchOnce, 30000);

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);

  const Card = ({ card }) => {
    const showWaiting = !card.latestResult;

    return (
      <section className="circlebox2">
        <div>
          <div className="sattaname">
            <p style={{ margin: 0 }}>{card.name}</p>
          </div>

          <div className="sattaresult">
            <p style={{ margin: 0, padding: 0 }}>
              <span style={{ letterSpacing: 4 }}>
                {card.loading ? (
                  "--"
                ) : showWaiting ? (
                  <img
                    src="images/d.gif"
                    alt="wait icon"
                    height={50}
                    width={50}
                  />
                ) : (
                  card.latestResult
                )}
              </span>
            </p>

            <p
              style={{
                margin: 0,
                fontSize: 14,
                marginTop: 5,
                fontWeight: "bold"
              }}
            >
              <small style={{ color: "white" }}>{card.resultTime}</small>
            </p>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div>
      <Card card={cards[2]} />
      <Card card={cards[0]} />
      <Card card={cards[1]} />
    </div>
  );
};







  return (
    <div>
      <section className="circlebox">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <div className="liveresult">
                <div id="clockbox">
                  <Clock />
                </div>
                <p className="hintext" style={{ padding: 0 }}>
                  हा भाई यही आती हे सबसे पहले खबर रूको और देखो
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- REPLACED GALI BLOCK ---------- */}
      <UpcomingResults games={games} loading={loading} />
      {/* ---------- end replaced block ---------- */}

      <LiveGameResult
        gameName="disawar"
        imgArrow="images/arrow.gif"
        imgWait="images/d.gif"
      />

      <div
        style={{
          boxSizing: "border-box",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          margin: "0.5rem auto",
          backgroundColor: "rgb(255, 255, 255)",
          overflow: "hidden",
          border: 0,
          borderRadius: "0.25rem",
        }} className="lucky-number-section"
      >
        <div className="rows">
          <div
            className="card-body notification munda"
            style={{
              display: "block",
              minHeight: 1,
              padding: "1.25rem",
              border: "1px dashed red",
              background: "#FFC107",
              borderRadius: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            <div><h2><b>आज की पकड़ जोड़ी</b></h2></div>
				<Luckynumber />		
            
            
          </div>
        </div>
      </div>
      
      <div
        style={{
          boxSizing: "border-box",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          margin: "0.5rem auto",
          backgroundColor: "rgb(255, 255, 255)",
          overflow: "hidden",
          border: 0,
          borderRadius: "0.25rem",
        }}
      >
        <div className="rows">
          <div
            className="card-body notification munda "
            style={{
              flex: "1 1 auto",
              minHeight: 1,
              padding: "1.25rem",
              border: "1px dashed red",
              background: "#FFC107",
              borderRadius: 20,
              fontWeight: "bold",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            <h2><b>मुंडा 01 से 100 नम्बरो तक की राशि/फैमिली</b></h2>
            <Link className="btnlink header_btn blck" to="/01-100-ki-family">
                    Check <span class="arw">→</span>
                </Link>
            
            
          </div>
        </div>
      </div>
      <CustomAds />

      <GroupTable groupName="gr1" />
      <GroupTable groupName="gr2" />

      <BottomAds />
  

      
		{/*<div
        style={{
          boxSizing: "border-box",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          margin: "0.5rem auto",
          backgroundColor: "rgb(255, 255, 255)",
          overflow: "hidden",
          border: 0,
          borderRadius: "0.25rem",
        }}

        className="card-body notification munda blv-section"
      >
        <div className="rows" style={{width: "100%",}}>
          <div
            className="card-body notification"
            style={{
              flex: "1 1 auto",
              minHeight: 1,
              padding: "1.25rem",
              border: "1px dashed red",
              background: "#FFC107",
              borderRadius: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            <h2>
              जिस व्यक्ति को तेज़ और विश्वसनीय परिणाम चाहिए, वे हमारे{" "}
              <Link to="https://whatsapp.com/channel/0029Vb6z44e17Ems4yyjTj0y">
                <strong> WhatsApp</strong>
              </Link>{" "} चैनल से जुड़ सकते हैं।
            </h2>
          </div>
        </div>
      </div>*/}

      
      <section className="octoberresultchart">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h5>SATTA RECORD CHART {new Date().getFullYear()}</h5>
            </div>
          </div>
        </div>
      </section>

      <div className="Select_selectMainDiv__QD2cf">
        <select
          aria-label="satta game name"
          className="Select_selectTag__IzyVd"
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
        >
          {games.map((game) => (
            <option key={game._id} value={game.name}>
              {game.name}
            </option>
          ))}
        </select>
       <select
          aria-label="year"
          className="Select_selectTag__IzyVd Select_secondTag__Q9uV_"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {Array.from(
            { length: currentYear - startYear + 1 },
            (_, i) => startYear + i
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button className="header_btn" type="button" onClick={handleCheck}>
          Check <span className="arw">→</span>
        </button>
      </div>
      <section className="octoberresultchart">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h2>
                <b>
                  SATTA RESULT CHART{" "}
                  {new Date()
                    .toLocaleString("en-US", { month: "long" })
                    .toUpperCase()}{" "}
                  {new Date().getFullYear()}
                </b>
              </h2>
            </div>
          </div>
        </div>
      </section>
      <MonthlyGroupTable groupName="gr1" />
      <MonthlyGroupTable groupName="gr2" />
		<section className="game-detail">
        <div className="containers">
          <div className="rowr">
            <div className="col-left">
              <div className="text-left2">
                <h1>
                  Discover Satta King: India’s Epic Number Game and Its Striking Festering

                </h1>
              </div>
            </div>
            <div className="col-right">
              <div className="content">
                <p>
                  SATTA KING - A7 Satta The Most Visited SATTA Site A7 Satta! With this guide, you will have a comprehensive look into Satta King game – from where it came from to how it is played, which the best markets are and why players need to play safe. Ready to explore? Let's break it down.
                </p>
                <h2>Satta King: What is it?</h2>
                <p>
                  Satta King isn’t even a game, it is more of a numbers game that is based on the practice of betting. In this game, individuals bet on the 2 to 4 last digits of a randomly drawn number. “Satta” translates to betting or gambling, while “King” describes whoever successfully bets on the winning number.
                </p>
                <Readmore>
                 

                  
<p>The best part about this game is that you can start with a small amount like ₹10 or ₹50. These days, many people play through apps or local agents. If the number that you picked matches, you could win many multiples of your original bet.</p>

<p>But it's ALL luck. Losing and gaining both have their share of outcomes, which is why it's always wise to use money wisely and responsibly.</p>

<h2>Satta King's Historical Background</h2>

<p>The gambling practice satta matka originated in the 1950s, after India became independent. It was originally known as ankada jugar (figures gambling). This consisted of wagering on the opening and closing rates of cotton as published by the New York Cotton Exchange, which were sent through teleprinters to the Bombay Cotton Exchange.</p>

<p>This system continued from 1950 to 1960. But by 1961, the New York Cotton Exchange had abolished these rates, so players started looking for an alternative.</p>

<p>They modernized the practice by using slips of paper (parchis) and a pot or pitcher (matka) to draw numbers. This became popular and was later called Satta King. Results started being updated daily.</p>

<p>In every city or village, players would seek a local khaiwal (bookie) who collected the slips and wrote the results on cement poles since everything operated underground in India.</p>

<p>Even today, satta lottery is not legal in most parts of India.</p>

<p>The word “Satta” is quite popular and the game is widely played in India, but it is illegal under Indian law.</p>

<h2>How to Play Satta King: A Comprehensive Step-by-Step Guide</h2>

<p>The game of Satta King may look simple, but it requires understanding before playing. Here's a beginner-friendly breakdown:</p>

<h3>Choose Your Numbers</h3>
<p>Pick any number between 00 and 99. For more complex plays, opt for “Panna” (any three digits, such as 121), “Jodi” pairings, or “Tira” sets. Each type has different odds — singles are simpler, while Pannas offer larger payouts.</p>

<h3>Place Your Bet</h3>
<p>Place bets online through apps, websites, or agents. Stakes can start from ₹100 or higher depending on preference. On digital platforms, deposit money, select a market, and confirm your entry.</p>

<h3>Await the Results</h3>
<p>Every market has fixed timings. Results are declared daily or weekly. For example, Disawar results may be announced at midnight, while Delhi Bazaar results are usually declared in the morning.</p>

<h3>Claim Your Winnings</h3>
<p>If your chosen number matches the drawn number, you win. Payouts vary — straight wins may offer around 90x your bet, while full Pannas can go up to 960x depending on the market rules.</p>

<p><strong>Pro Tip:</strong> Always check market timings to avoid missing results. Remember, outcomes are based on luck.</p>

<h2>What is Jodi, Crossing, Haruf in Satta King?</h2>

<h3>Jodi</h3>
<p>Numbers from 00 to 99 are known as Jodi. You can select your favorite lucky number and bet on it.</p>
<p>Examples: 11, 22, 33, 44, 55, 66, 77, 88, 99, 00 are Jodi numbers.</p>

<h3>Crossing</h3>
<p>Crossing is constructed using multiple numbers (usually 3 to 8 or more).</p>
<p>Example: 123456 is a 6-number crossing. In this, 36 Jodi combinations are formed.</p>

<h3>Haruf</h3>
<p>Haruf refers to selecting a single digit.</p>
<p>Example: 1 is a Haruf.</p>
<p>If played, 10 Jodi combinations are formed. You must also specify whether it is Ander (inside) or Bahar (outside).</p>

<h2>The Most Essential Satta King Markets</h2>

<p>Different regional markets operate with unique timings and popularity:</p>

<p><strong>Delhi Bazaar Satta:</strong> Popular market with daily declared results.</p>
<p><strong>Disawar Satta:</strong> Midnight market known for high participation.</p>
<p><strong>Faridabad Satta:</strong> Popular among beginners.</p>
<p><strong>Ghaziabad Satta:</strong> Known for regular draws.</p>
<p><strong>Gali Satta:</strong> Late-night result market.</p>

<h2>The Risks: Play Smart</h2>

<p>Satta King involves financial and legal risks.</p>

<p><strong>Financial Risk:</strong> Only bet what you can afford to lose.</p>
<p><strong>Addiction Risk:</strong> Quick results and large payouts can become addictive.</p>
<p><strong>Legal Issues:</strong> The game is illegal in many parts of India.</p>
<p><strong>Scams:</strong> Fraud risks exist in underground operations.</p>

<p>This information is provided for awareness purposes only.</p>

<h2>Platforms like A7 Satta</h2>

<p>A7 Satta provides online result updates for various Satta markets. It publishes daily results and historical charts for informational purposes.</p>

<p>Markets listed may include Delhi Bazaar, Disawar, Gali, Ajmer, Ghaziabad, Shree Ganesh, Golden City, Navi Mumbai, Sadar Bazaar, Cyber City Gurgaon, and Paisa Bazaar.</p>

<p>The platform also shares charts and number analysis for informational reference.</p>

<h2>The A7 Satta Edge - How We Stay On Top of The Market</h2>

<p>A7 Satta provides live results, record charts, and a user-friendly interface to help users check updates easily.</p>

<p>It focuses on timely updates, chart history access, and simplified navigation.</p>

<h2>Strategy & Predictions</h2>

<p>Some platforms provide expert number suggestions, charts, and historical records to help users understand patterns.</p>

<p>However, outcomes are based entirely on chance, and no strategy guarantees success.</p>
                </Readmore>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ /> */}
    </div>
  );
};

export default Home;









