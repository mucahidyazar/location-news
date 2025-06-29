import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // GitHub repository bilgileri - bu değerleri kendi repo bilgilerinizle değiştirin
    const GITHUB_OWNER = process.env.GITHUB_OWNER || 'yourusername'
    const GITHUB_REPO = process.env.GITHUB_REPO || 'mappy.news'
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN // GitHub Personal Access Token (opsiyonel, rate limit için önerilir)

    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits`

    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'mappy.news'
    }

    // GitHub token varsa authorization header ekle
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: 300 } // 5 dakika cache
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const commits = await response.json()

    // Commit verilerini sadeleştir
    const formattedCommits = commits.map((commit: {
      sha: string;
      commit: {
        message: string;
        author: {
          name: string;
          email: string;
          date: string;
        };
      };
      html_url: string;
    }) => ({
      sha: commit.sha,
      message: commit.commit.message.split('\n')[0], // Sadece ilk satır
      author: {
        name: commit.commit.author.name,
        email: commit.commit.author.email
      },
      date: commit.commit.author.date,
      url: commit.html_url
    }))

    return NextResponse.json(formattedCommits)
  } catch (error) {
    console.error('Error fetching commits:', error)

    // Hata durumunda mock data döndür
    const mockCommits = [
      {
        sha: 'a1b2c3d4e5f6',
        message: 'Add smooth sidebar animations and improve UX interactions',
        author: {
          name: 'Developer',
          email: 'dev@locationnews.com'
        },
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 saat önce
        url: 'https://github.com/yourusername/mappy.news/commit/a1b2c3d4e5f6'
      },
      {
        sha: 'b2c3d4e5f6g7',
        message: 'Fix datepicker width to 320px and resolve map graying issues',
        author: {
          name: 'Developer',
          email: 'dev@locationnews.com'
        },
        date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 saat önce
        url: 'https://github.com/yourusername/mappy.news/commit/b2c3d4e5f6g7'
      },
      {
        sha: 'c3d4e5f6g7h8',
        message: 'Implement interactive map with dynamic news location markers',
        author: {
          name: 'Developer',
          email: 'dev@locationnews.com'
        },
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 gün önce
        url: 'https://github.com/yourusername/mappy.news/commit/c3d4e5f6g7h8'
      },
      {
        sha: 'd4e5f6g7h8i9',
        message: 'Add news filtering by category, source and date range',
        author: {
          name: 'Developer',
          email: 'dev@locationnews.com'
        },
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 gün önce
        url: 'https://github.com/yourusername/mappy.news/commit/d4e5f6g7h8i9'
      },
      {
        sha: 'e5f6g7h8i9j0',
        message: 'Create responsive news sidebar with multiple view types',
        author: {
          name: 'Developer',
          email: 'dev@locationnews.com'
        },
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 gün önce
        url: 'https://github.com/yourusername/mappy.news/commit/e5f6g7h8i9j0'
      },
      {
        sha: 'f6g7h8i9j0k1',
        message: 'Setup Next.js project with TypeScript and Tailwind CSS',
        author: {
          name: 'Developer',
          email: 'dev@locationnews.com'
        },
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 hafta önce
        url: 'https://github.com/yourusername/mappy.news/commit/f6g7h8i9j0k1'
      }
    ]

    return NextResponse.json(mockCommits)
  }
}