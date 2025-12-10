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

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

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
    if (!selectedGame) return;
    const gameSlug = selectedGame.toLowerCase().replace(/\s+/g, "-");
    navigate(`/${gameSlug}?year=${selectedYear}`);
  };

const UpcomingResults = () => {
  const [cards, setCards] = useState([
    { loading: true },
    { loading: true },
    { loading: true }
  ]);

  const mountedRef = useRef(false);
  const controllerRef = useRef(null);
  const intervalRef = useRef(null);

  // Build 3-card layout
  const formatCards = (recent, upcoming) => {
    const final = [];

    if (recent.length >= 2) {
      // 2 recent + 1 upcoming
      final.push(recent[0], recent[1]);
      if (upcoming.length > 0) final.push(upcoming[0]);

    } else if (recent.length === 1) {
      // 1 recent + 2 upcoming
      final.push(recent[0]);
      final.push(...upcoming.slice(0, 2));

    } else {
      // No recent → all upcoming
      final.push(...upcoming.slice(0, 3));
    }

    while (final.length < 3) {
      final.push({
        name: "--",
        resultTime: "--",
        latestResult: null,
        loading: false
      });
    }

    return final.slice(0, 3);
  };

  const fetchOnce = async () => {
    try {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();

      const r = await api.get("/upcoming", {
        signal: controllerRef.current.signal
      });

      if (!mountedRef.current) return;

      // Take correct fields from backend
      const rawRecent = r.data.recentGames || [];
      const rawUpcoming = r.data.upcomingGames || [];

      // Map frontend fields
      const recent = rawRecent.map(item => ({
        name: item.name,
        resultTime: item.resultTime,
        latestResult: item.latestResult,
        minutesUntil: 0,
        loading: false
      }));

      const upcoming = rawUpcoming.map(item => ({
        name: item.name,
        resultTime: item.resultTime,
        latestResult: item.latestResult,
        minutesUntil: item.minutesUntil || null,
        loading: false
      }));

      const finalCards = formatCards( upcoming,recent);

      setCards(finalCards);

    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Fetch upcoming failed:", err);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchOnce();

    intervalRef.current = setInterval(fetchOnce, 30000);

    return () => {
      mountedRef.current = false;
      if (controllerRef.current) controllerRef.current.abort();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const Card = ({ card }) => {
    return (
      <section className="circlebox2">
        <div>
          <div className="sattaname">
            <p style={{ margin: 0 }}>{card.name}</p>
          </div>

          <div className="sattaresult">
            <p style={{ margin: 0, padding: 0 }}>
              <span style={{ letterSpacing: 4 }}>
                {card.loading
                  ? "--"
                  : card.latestResult == null
                    ? <img src="images/d.gif" width={50} height={50} />
                    : card.latestResult}
              </span>
            </p>

            <p style={{ margin: 0, fontSize: 14, marginTop: 5 }}>
              <small style={{ color: "white" }}>{card.resultTime}</small>
            </p>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div>
      {cards.map((c, i) => <Card key={i} card={c} />)}
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
        }}
      >
        <div className="row">
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
              textTransform: "uppercase",
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
        <div className="row">
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
              textTransform: "uppercase",
            }}
          >
            <h2>
              जिस भी व्यक्ति को तेज़ और विश्वसनीय परिणाम चाहिए, वे हमारे{" "}
              <Link to="#">
                <strong> Telegram </strong>
              </Link> {" "}
              ग्रुप से जुड़ सकते हैं।
            </h2>
          </div>
        </div>
      </div>
      <CustomAds />

      <GroupTable groupName="gr1" />
      <GroupTable groupName="gr2" />

      <BottomAds />
      <br />
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
          <option> {new Date().getFullYear()}</option>;
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
                  7A Satta — Trusted Satta King Results, Charts & Market Guides
                </h1>
              </div>
            </div>
            <div className="col-right">
              <div className="content">
                <p>
                  Welcome to 7A Satta — your dependable source for verified
                  Satta King results, historical charts and market timings. We
                  provide clear result updates, trend analysis and responsible
                  play guidance so users can research markets with confidence.
                </p>
                <h2>What is Satta King?</h2>
                <p>
                  Satta King is an online game, where you can also stand a
                  chance to win with the help of betting. It is a kind of
                  lottery or gambling on the last two to four digits of selected
                  numbers at predetermined intervals. The word <b>“Satta”</b>{" "}
                  usually means betting or gambling and <b>“King”</b> is the
                  term which refers to the person who gets triumph in a match.
                </p>

                {/* ... the rest remains unchanged ... */}

                <Readmore>
                  <p>
                    Satta King has its roots in the older systems of lotteries,
                    but it is now the most popular game with a number of
                    variants and regional platforms. It delivers the excitement
                    of gambling and chance to win big prizes, but all on a
                    screen and from modest starting bets.
                  </p>

                  <h2>The Historical Background of Satta King</h2>

                  <p>
                    SattaKing game started in the middle of 20th century. It
                    derived from a game called <b>“Matka,”</b> originating back
                    in the times when people would place money on the
                    opening/closing rate of cotton, which was then transmitted
                    to the Bombay Cotton exchange from New York. The game was
                    brought to India where it developed into various regional
                    forms. Matka gained widespread popularity in cities such as
                    approximately Mumbai and Delhi.{" "}
                  </p>

                  <p>
                    Matka gambling was the game at first, but when it was
                    banned, people continued playing this kind of gambling which
                    has evolved to ‘Satta’ King today. The game eventually
                    spread to other cities and became associated with different
                    markets (or “bazaars”), each with its own timing and winning
                    numbers.
                  </p>

                  <p>
                    Satta King receives widespread participation despite legal
                    limitations, with players anxiously anticipating the results
                    of daily draws that reveal winners. The game has since
                    migrated in many places to the internet, which explains why
                    you get results or other way of playing quicker than before.
                  </p>

                  <h2>How to Play Satta King?</h2>
                  <p>
                    Satta King is so simple to play, however you should be quite
                    careful also. Here’s a simplified explanation:
                  </p>

                  <h3>Choosing Numbers</h3>
                  <p>
                    Participants choose a number from 0 to 99. These numbers can
                    also be selected, subsequently, individually but are usually
                    taken in pairs (Jodi), triples ("Panna") or as back and
                    close pair. There are various kinds of bet with different
                    payout rates and odds.
                  </p>

                  <h3>Placing Bets</h3>
                  <p>
                    How to play Players can bet on numbers via operators or
                    their agents, or by using online apps. Lakhani said the
                    amount bet is small— 10 or 50, “but one wins many times the
                    money if it comes through.
                  </p>

                  <h3>Declaring Results</h3>
                  <p>
                    Every Satta market have daily or weekly draws where they
                    open a number and get declared winner. Results are declared
                    at fixed times—Delhi Bazar at a particular hour, Disawar and
                    Faridabad also at different hours.
                  </p>

                  <h3>Winning and Payouts</h3>
                  <p>
                    If the player’s selected number corresponds to the winning
                    number announced for that draw, then the player wins.
                    Payouts may be between 90 –960 times the value of the
                    original bet or more, depending on both the type of bet and
                    market.
                  </p>

                  <h3>Popular Satta King Markets</h3>
                  <p>
                    Satta King isn’t just one game but a lot of betting markets
                    found in the Indian subcontinent. Every market will have
                    unique draws and times, along with its own rules and
                    results. Here are some of the most popular markets:
                  </p>

                  <p>
                    <b>Delhi Bazar Satta:</b> Among the oldest and most famous
                    markets, which has daily draw2.
                  </p>
                  <p>
                    <b>Disawar Satta:</b> It is famous for high popularity among
                    the players and daily draws.
                  </p>
                  <p>
                    <b>Faridabad Satta:</b> New market that is gaining
                    popularity.
                  </p>
                  <p>
                    <b>Ghaziabad Satta:</b> Well known for frequent updates and
                    player engagement.
                  </p>
                  <p>
                    <b>Gali Satta Market:</b> A market known for its different
                    draw time.
                  </p>
                  <p>
                    There is a separate website or portal for each market, where
                    players can go see the results, and players also use apps or
                    websites like 7A Satta to get real-time updates.
                  </p>

                  <h3>Understanding the Risks and Cautions</h3>
                  <p>
                    Satta King can be fun and rewarding, but it also comes with
                    a lot of risk:
                  </p>
                  <p>
                    <b>Economic risk:</b>a The higher risk players will lose
                    money as the house always has an edge against the gambler.
                    The amount you can lose should be your bottom line when
                    gambling.
                  </p>
                  <p>
                    <b>Addiction:</b> The speed of the game and potential for
                    high rewards can create a cycle of compulsive gambling.
                  </p>
                  <p>
                    <b>Legal FAQs:</b> Satta King is not a legal lottery system
                    or gambling option in most Indian states and playing it or
                    betting on it can have serious legal impacts as well.
                  </p>
                  <p>
                    <b>Trust Issues:</b> The game is mainly run underground or
                    unofficially, players need to watch out for scam sites and
                    fraud operators.
                  </p>
                  <p>
                    At 7A Satta, we offer the counsel of verified fruits and
                    teachings; we do not support issue nor do get to tell that
                    you to issues.
                  </p>

                  <h3>Role of Platforms Like 7A Satta</h3>
                  <p>Platforms like 7A Satta are important because they:</p>
                  <p>
                    <b>Verified Results:</b> Fast, instant publishing of lottery
                    draw results to reduce misinformation.
                  </p>
                  <p>
                    <b>Historical Data:</b> The Secret Powerball Technique also
                    give players access to the archived winning numbers from
                    previous drawings, and charts that allow them see the
                    winning patterns.
                  </p>
                  <p>
                    <b>Real-time Push Alerts:</b> You will never miss a single
                    point, game or set in tennis; now it is up to you!
                  </p>
                  <p>
                    <b>Player Education:</b> Providing tips, strategies and
                    responsible gaming information so players can make informed
                    decisions.
                  </p>
                  <p>
                    <b>Privacy and Security Assured:</b> All user data is kept
                    confidential and protected from abuse.
                  </p>

                  <h3>Tips for Responsible Engagement</h3>
                  <p>
                    Stick to an amount that you are willing to wager and never
                    go beyond it.
                  </p>
                  <p>Never play to win back what you have lost.</p>
                  <p>
                    Occasional breaks: It doesn't hurt to step away from the
                    game.
                  </p>
                  <p>— Get help for gambling addiction if you suspect it.</p>
                  <p>
                    Know and respect the laws of your area with regards to
                    gambling.
                  </p>

                  <h3>Conclusion</h3>
                  <p>
                    Satta king is still a game of luck for the people across
                    India. It may be entertaining and have the potential for
                    monetary rewards but it should always be played responsibly,
                    informed, and with a level head. ABOUT US 7A Satta is run
                    and managed by the best satta company in India, with an
                    experience of 40 long years.
                  </p>

                  <p>
                    And let’s be clear – gambling should not be your plan A in
                    terms of income or investment. Remember to always play
                    responsibly, be in the know and come for updates on Satta
                    King at reliable sources.
                  </p>
                </Readmore>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ />
    </div>
  );
};

export default Home;
