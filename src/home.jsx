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
                 

 <p>The best part about this game is that you can start with a small amount like ₹10 or ₹50. These days, many people play through apps or local agents. If the number that you picked is matched, you could win many multiples of your original bet.</p>

<p>But it's ALL luck. Losing and gaining both luck their share of the outcomes, which is why its always wise to use money wisely and responsibly.</p>

<h2>Satta King's Historical Background</h2>
<p>The gambling practice satta matka, which originated in the 1950s (beyond a time when India was becoming independent), came into existence after independence. It was originally known as ankada jugar (figures gambling). This consisted of wagering on the opening and closing rates of cotton as published by the New York Cotton Exchange, which were sent to him through teleprinters from the Bombay Cotton Exchange.</p>

<p>This system continued as it was from 1950 to 1960. But by 1961 the New York Cotton Exchange had 'abolished' these rates. So they started looking for an alternative.</p>

<p>They subsequently modernized the practice by using slips of paper (parchis) and a pot or pitcher (matka) to draw the numbers. This was became popular which called it satta king. Results started being updated daily.</p>

<p>In every city or village, players would seek a local khaiwal (bookie) who accumulated the slips and wrote the results on cement poles since everything was underground in India.</p>

<p>Even today, satta lottery is not legal in most of India.</p>

<p>The word ‘Satta‘ is quite popular and the game is widely played in India, but it is illegal under Indian law.</p>

<h2>How to Play Satta King: A Comprehensive Step by Step Guide</h2>
<p>The game of Satta King: It isn’t easy to play the Satta king game once again after then your mind is powerful. Here's a safe, beginner-friendly breakdown:</p>

<h3>Choose Your Numbers</h3>
<p>Pick any number between 00 and 99. For more complex plays, opt for “Panna” (any three digits, as in 121), “Jodi” pairings or “Tira” sets. There are varying odds to every type – on singles it can be fairly simplistic, more a lines prize thing for Pannas.</p>

<h3>Place Your Bet</h3>
<p>Make outside bets online through reputable apps, sites or agents. Actual stakes: ₹100, or play with ₹1000 to get a bit more bold. All of that’s easy on digital platforms — deposit money, pick an etf market and confirm.</p>

<h3>Await the Results</h3>
<p>Every market has fixed timings. Results fall off daily or weekly, posted for all to see. For example, Disawar results may be declared at midnight and the result of Delhi Bazaar will only come in the morning.</p>

<h3>Claim Your Winnings</h3>
<p>Match the drawn number? Congratulations! Payouts vary from 90x your bet for straight wins up to or over 960x for clever moves like full Pannas. Trusted sites credit wins immediately.</p>

<p>Pro Tip: Make sure to check market timings to avoid missing out. You’ll be able to identify trends with enough practice, but the fates favour luck. What is Jodi, Crossing, Haruf in Satta King?</p>

<h3>Jodi</h3>
<p>The numbers 01 to 100 are known as jodi. You can select your own favorite lucky number and bet on it.</p>
<p>Example: 11, 22, 33, 44, 55, 66, 77, 88, 99, 00 are Jodi.</p>
<p>The numbers 1 through 10 are called munda.</p>
<p>11-100 are known as jodi.</p>
<p>Some numbers, such as between 11 and 100, are also known as joda.</p>

<h3>Crossing</h3>
<p>Many players also play crossing. Crossing is constructed with three numbers and you can play around 3 to 8–9 numbers.</p>
<p>Example: 123456 is a "6-number crossing".</p>
<p>In this, 36 jodi are formed.</p>
<p>If you say jodi cut, then 6 are out of jodi means there r 30 jodi left.</p>

<h3>Haruf</h3>
<p>In his voice breaks and in bed, Haruf speaks of one number only.</p>
<p>Example: 1 is a haruf.</p>
<p>If you play it, 10 jodi will be made.</p>
<p>You also need to state whether it is Ander (inside) or Bahar (outside) before you begin.</p>
<p>If you play side A only 10 jodi are created.</p>
<p>If you double play through front or back side AB then twenty jodi are made.</p>
<p>If you haruf, your chances of getting through are higher.</p>

<h2>The Most Essential Satta King Markets Reveal Below must know</h2>
<p>VARIETY is the spice for Satta King and markets looks so regional centre of power. Each has its own groove, timing and community of regulars. Here are some that we found most interesting:</p>

<p>Delhi Bazaar Satta: The veteran’s favourite, providing daily results that keep the Delhi gaming scene vibrant.</p>
<p>Disawar Satta: A midnight risk for the high rollers, famous for attracting a large number of players and its strong live draws.</p>
<p>Faridabad Satta: A rising star with a new face and trends chasing perfect for beginners.</p>
<p>Ghaziabad Satta: Interactive and vibey with the real time offer.</p>
<p>Gali Satta: Out of nowhere and at unlikely hours, its draw is seducing night-owls across the country.</p>

<p>For live results, you can check dedicated websites and apps such as A7 Satta. Those markets are the engine that drives Satta King’s social impact: the online communities they build, in which players share tips and celebrate wins.</p>

<h2>The Risks: Play Smart, Not Safe</h2>
<p>Satta King is a thrill — and it’s not without shadows. It's important to be aware so we can learn how to partake responsibly.</p>
<p>Financial Risk: No, but the deck is stacked against you. Only bet what you can afford to lose – gambling is supposed to be fun, not lucrative.</p>
<p>Addiction Potential: Quick draws and large-win fantasies are addictive. Set limits to keep it fun.</p>
<p>Legal Gray Areas: It is prohibited in much of India and carries penalties. Stay informed on local laws.</p>
<p>Scam Alerts: Underground ops breed fraud. Resist the fakes by sticking with established sites.</p>
<p>We inform not promote – knowledge is power for taking safer decisions.</p>

<h2>Platforms like A7 Satta's Function</h2>
<p>A7 Satta is among the oldest and most reliable market for “Satta Matka” results on internet. Created for the purpose of getting information out there quickly, accurately and honestly, our website sees thousands of daily users counted on to keep them informed. We are dedicated to the Satta King category publishing superfast all Satta King games results on our website, and providing you with accurate results and updates very quickly in no time at https://www.7asatta.com.</p>

<p>Here on our platform, we have a list of multiple games including top markets such as Delhi Bazaar, Disawar, Gali, Ajmer Sarif, Ghaziabad and Shree Ganesh and also there are regional games such as Golden City, Navi Mumbai, Sadar Bazaar, Cyber City Gurgaon, Paisa Bazaar along with many more. Every result comes with thorough record, making it possible to see the past results and be a better prediction.</p>

<p>Apart from results, A7 Satta provides “Pakad Jodi” numbers, Rashi charts and expert advice shared by seasoned players. These community capabilities let users learn from trends and enhance their strategies. And the most important thing, we don't organize and encourage gambling in any way - but serve as some information platform for those who wants to. A7 Satta was and still is home to dependable, user-friendly Satta King results.</p>

<h2>The A7 Satta Edge - How We Stay On Top of The Market</h2>
<p>In the fast moving world of sattaplay A7 Satta is the king of sattaplay!!</p>

<p>Ultra-Fast Live Results: Satta is all about timing. A7 Satta provides live results, so no need to search for other places and you will get all result at one place.</p>
<p>Easy Record Charts: A7 Satta provides record charts of satta king games that allow you to perceive the game tricks before-time, guess next number and eliminate any chances of loss.</p>
<p>User-Friendly Interface: With an easy-to-use interface, both seasoned and beginners can find their way around the platform to view results, chart invites as well as updates.</p>
<p>Reliability & Accuracy: where many websites are not very reliable, A7 Satta would always try to be a clear winner OMG every day.</p>
<p>Security & Privacy: With strong security layers, A7 Satta offers privacy to users while they check out the results in privacy.</p>
<p>A7 Satta is not like just other site, it's es a market leader in the world of A7 satta matka.</p>

<h2>Strategy & Predictions: Win with smarts</h2>
<p>At A7 Satta, we turn out to be supportive of our users by providing all the information they need to make informed bets. More than numbers, we offer insights.</p>
<p>Expert Pakad Jodi: Get premium "Pakad Jodi" posts from experienced punters. These authorities rely on long years of experience and ancient record charts to decide winning combinations.</p>
<p>Rashi & Family Charts (1–100): Use our charts based on Rashi. [related] With family numbers, Rashi patterns and other such phenomena, you can train yourself in divining forecasts.</p>
<p>Improved Likelihood of Winning: Our data-driven approach helps you be the best at fantasy and increase your odds of success.</p>
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










