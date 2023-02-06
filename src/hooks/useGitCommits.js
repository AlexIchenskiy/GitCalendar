import moment from "moment";
import { useEffect, useState } from "react";

const useGitCommits = (user, year, month) => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let currCommits = [];
    setCommits([]);

    const getCommits = async (page = 1) => {
      let hasMore = true;
      if (!hasMore) {
        return;
      }

      const username = user || "AlexIchenskiy";
      const date = moment().year(year).month(month);
      const since = date.startOf("month").format("YYYY-MM-DD");
      const until = date.endOf("month").format("YYYY-MM-DD");

      const params = {
        author: username,
        "committer-date": since + ".." + until,
      };

      const queryString = Object.keys(params)
        .map((key) => `${key}:${params[key]}`)
        .join("+");

      try {
        const res = await fetch(
          `https://api.github.com/search/commits?q=${queryString}&page=${page}`
        );

        const data = (await res.json()).items;
        if (!data || data.length === 0) {
          hasMore = false;
          return;
        }

        currCommits = [...currCommits, ...data];

        const linkHeader = res.headers.get("Link");
        if (linkHeader && linkHeader.match(/<(.*?)>; rel="next"/)) {
          getCommits(++page);
        } else {
          currCommits.sort(
            (comm1, comm2) =>
              moment(comm1.commit.author.date) -
              moment(comm2.commit.author.date)
          );
          setCommits(currCommits);
          hasMore = false;
          setLoading(false);
        }
      } catch (error) {
        setError(error);
        setLoading(true);
      } finally {
        hasMore = false;
        setLoading(false);
      }
    };
    getCommits();
  }, [user, year, month]);

  return { loading, commits, error };
};

export default useGitCommits;
