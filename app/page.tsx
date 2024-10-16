"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

interface VideoData {
  title: string;
  views: number;
  thumbnail: string;
}

interface GraphData {
  name: string;
  views: number;
}

export default function Home() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [videoData, setVideoData] = useState<VideoData[]>([]);
  const [graphData, setGraphData] = useState<GraphData[]>([]);

  const [defaultData, setDefaultData] = useState<any>(
    {
      videoData:
      [
        {
            title: "Expand your knowledge and network at GitHub Universe 2024 | Buy your tickets now",
            views: 2900,
            thumbnail: "https://i.ytimg.com/vi/GhnCiV23PQE/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAIkljo4GyEQKyHF3_o6-70OmFPKQ",
            videoDate: "5 months ago"
        },
        {
            title: "Gear up for GitHub Universe 2024: a celebration of code and community",
            views: 4800,
            thumbnail: "https://i.ytimg.com/vi/hKgTC6d11w4/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDGxkxIGiOJFijd9-gGVU73Dq9bgA",
            videoDate: "5 months ago"
        },
        {
            title: "Gear up for GitHub Universe 2024: a celebration of code and community",
            views: 2500,
            thumbnail: "https://i.ytimg.com/vi/Dmchc0dCOa4/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAGYKkCeynw5fT86Qqqe9QU3py_3Q",
            videoDate: "1 month ago"
        },
        {
            title: "Gear up for GitHub Universe 2024: a celebration of code and community - Audio Descriptive Version",
            views: 2900,
            thumbnail: "https://i.ytimg.com/vi/ugc7yNHNX1Y/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBpegrOzqIvmqy6YjB24HPknh02Ug",
            videoDate: "1 month ago"
        },
        {
            title: "How to become a speaker at GitHub Universe 2024",
            views: 480,
            thumbnail: "https://i.ytimg.com/vi/nX0fF_7neg0/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCGjg6n20ykOuUUn1htpa9PpkuwSA",
            videoDate: "1 month ago"
        }
    ],
    graphData:[
     
      {name: 'Video 1', views: 2900, date: '5 months ago'},
      {name: 'Video 2', views: 4800, date: '5 months ago'},
      {name: 'Video 3', views: 2500, date: '1 month ago'},
      {name: 'Video 4', views: 2900, date: '1 month ago'},
      {name: 'Video 5', views: 480, date: '1 month ago'}
        ]
    }
    
  );

  const [isLoading, setIsLoading] = useState(false);
  console.log({ graphData });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/scrape-playlist", {
        playlistUrl,
      });
      console.log({ response });

      if (!response) {
        throw new Error("Failed to fetch playlist data");
      }

      const data = response.data;
      setVideoData(data.videoList);
      setGraphData(data.graphData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    } else {
      return views.toString();
    }
  };

  const getStrokeColor = (data:any) => {
    // Check if the data trend is going up or down (compare first and last points)
    if (data.length < 2) return 'green'; // Default color if there's not enough data to compare

    const isIncreasing = data[data.length - 1].views >= data[0].views;
    return isIncreasing ? 'green' : 'red';
  };

  const playlistLink = "https://www.youtube.com/playlist?list=PL0lo9MOBetEF_de7yKAWpnMkTsKH6aJ4P";

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle title="Enter a YouTube playlist URL to analyze its videos">YouTube Playlist Analyzer</CardTitle>
          
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 flex items-center">
            <Input
              style={{width:"85%", marginRight:'1rem'}}
              type="url"
              placeholder={`Go to the playlist section in the channel, click "View Playlist Details," then copy the link from the address bar.`}
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              required
            />
            <Button style={{marginTop:"0px"}} type="submit" className="" disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Analyze Playlist"}
            </Button>
          </form>
          {videoData.length < 1 && !isLoading && (
  <div className="pt-4">
    <p>
    Below is the default data from this 
      <a href={playlistLink} title={playlistLink} className="text-blue-500" target="_blank" rel="noopener noreferrer"> YouTube playlist</a>.
      It will change when you enter a new link.
    </p>
  </div>
)}
        </CardContent>
      </Card>

      { !isLoading &&(
        <>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Video List</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[600px]">
  <ul className="space-y-4">
    {
      (() => {
        const data = videoData.length < 1 && !isLoading ? defaultData.videoData : videoData;
        return data.map((video:any, index:any) => (
          <li key={index} className="flex items-start space-x-4">
            <span className="font-bold text-lg min-w-[24px]">
              {index + 1}.
            </span>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-24 h-auto"
            />
            <div>
              <h3 className="font-semibold">{video.title}</h3>
              <p className="text-sm text-gray-600">
                {formatViews(video.views)} views
              </p>
            </div>
          </li>
        ));
      })()
    }
  </ul>
</CardContent>

          </Card>

          {/* Grid for the next two cards */}
          <div className="grid grid-rows-0 gap-1 md:col-span-1">
            {/* Stats Card (Short Height) */}
            <Card className="h-34">
              <CardHeader>
                <CardTitle>Playlist Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 mb-4 md:grid-cols-2 gap-4">
                  <div className="flex ">
                    <h3 className="font-semibold mr-4">Total Videos:</h3>
                    <p>{
                      videoData.length <1 && !isLoading ?defaultData.videoData.length :videoData.length}</p>
                  </div>
                  <div className="flex ">
                    <h3 className="font-semibold mr-4">Total Views:</h3>
                    <p>
                    {(() => {
                      const data = videoData.length <1 && !isLoading ?defaultData.videoData :videoData
                        const totalViews =
                        data.reduce(
                            (total:any, video:any) => total + video.views,
                            0
                          )
                        return (
                          <span title={String(totalViews)}>
                            {formatViews(totalViews)}
                          </span>
                        );
                      })()}
                    </p>
                  </div>
                  <div className="flex ">
                    <h3 className="font-semibold mr-4">
                      Average Views per Video:
                    </h3>
                    <p>
                      {(() => {
                      const data = videoData.length <1 && !isLoading ?defaultData.videoData :videoData

                        const avgViews = Math.round(
                          data.reduce(
                            (total:any, video:any) => total + video.views,
                            0
                          ) / data.length
                        );
                        return (
                          <span title={String(avgViews)}>
                            {formatViews(avgViews)}
                          </span>
                        );
                      })()}
                    </p>
                  </div>
                  <div className="flex ">
                    <h3 className="font-semibold mr-4">View Trend:</h3>
                    <p>
                      {(() => {
                      const data = videoData.length <1 && !isLoading ?defaultData.videoData :videoData

                        const firstVideo = data[0];
                        const lastVideo = data[data.length - 1];
                        const diff = lastVideo?.views - firstVideo.views;
                        const percentage = (diff / firstVideo.views) * 100;
                        const roundedPercentage = Math.round(percentage);

                        return (
                          <span>
                            {percentage > 0 ? (
                              <span className="text-green-500">
                                ▲ {roundedPercentage}%
                              </span>
                            ) : (
                              <span className="text-red-500">
                                ▼ {Math.abs(roundedPercentage)}%
                              </span>
                            )}
                          </span>
                        );
                      })()}
                    </p>
                  </div>
                </div>
                <div className="flex ">
                  <h3 className="font-semibold mr-4">Most Watched:</h3>
                  <p>
                    {(() => {
                      const data = videoData.length <1 && !isLoading ?defaultData.videoData :videoData
                      
                      const title = data.reduce(
                        (max:any, video:any) => (video.views > max.views ? video : max),
                        data[0]
                      ).title;

                      return (
                        <span title={title}>
                          {title.length > 70
                            ? title.slice(0, 70) + "..."
                            : title}
                        </span>
                      );
                    })()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* View Count Graph Card (Full height) */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>View Count Graph</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data=
                  {graphData.length <1 && !isLoading ?defaultData.graphData :graphData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="step"
                      dataKey="views"
                      stroke={getStrokeColor(graphData.length <1 && !isLoading ?defaultData.graphData :graphData)}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
