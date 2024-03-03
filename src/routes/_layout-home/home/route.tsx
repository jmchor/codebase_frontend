import { useNavigate, createFileRoute } from '@tanstack/react-router';
import ProjectCard from '../../../components/cards/ProjectCard';
import useGetProjects from '../../../services/getProjects';
import { useState } from 'react';
import useGetArticles from '../../../services/getArticles';
import ArticleCard from '../../../components/cards/ArticleCard';
import { Spacer } from '../../../styles/Spacer';
import {
	ArticleContainer,
	ContainerWithHeader,
	FilterContainer,
	HomePageWrapper,
	Image,
	LinkButton,
	MoreButton,
	OptionalContainer,
	ProjectGrid,
} from '../../../styles/HomeRouteStyles';
import { useAuth } from '../../../auth';

export const Route = createFileRoute('/_layout-home/home')({
	component: Home,
});

function Home() {
	const [counts, setCounts] = useState<{ projects: number; articles: number }>({ projects: 4, articles: 3 });
	const [filter, setFilter] = useState<'projects' | 'articles' | 'all'>('all');
	const [showOptional, setShowOptional] = useState(true);

	const auth = useAuth();

	const navigate = useNavigate();

	const { data: projectData, error: projectError, loading: projectLoading } = useGetProjects(0);
	const { data: articleData, error: articleError, loading: articleLoading } = useGetArticles();

	if (projectLoading || articleLoading) return <p>Loading...</p>;
	if (projectError || articleError) return <p>Error</p>;

	const projects = projectData?.allProjects || [];
	const articles = articleData?.allArticles || [];

	const showMore = (type: 'projects' | 'articles') => {
		setCounts((prevCounts) => ({ ...prevCounts, [type]: prevCounts[type] + 2 }));
	};

	const handleFilterChange = (selectedFilter: 'projects' | 'articles' | 'all') => {
		setFilter(selectedFilter);
	};

	return (
		<HomePageWrapper>
			<FilterContainer>
				<LinkButton onClick={() => handleFilterChange('all')}>
					<Image src='/static/infinite.svg' alt='' active={filter === 'all'} />
				</LinkButton>
				<LinkButton onClick={() => handleFilterChange('projects')}>
					<Image src='/static/coding.svg' alt='' active={filter === 'projects'} />
				</LinkButton>
				<LinkButton onClick={() => handleFilterChange('articles')}>
					<Image src='/static/article.svg' alt='' active={filter === 'articles'} />
				</LinkButton>
			</FilterContainer>

			{showOptional && !auth.user ? (
				<OptionalContainer>
					<button onClick={() => setShowOptional(false)}> X </button>
					<p>Don't have an account yet? Sign up now!</p>
					<button
						onClick={() => {
							navigate({ to: '/signup' });
						}}
					>
						Sign Up
					</button>
					<Spacer />
				</OptionalContainer>
			) : null}

			{filter === 'all' || filter === 'projects' ? (
				<ContainerWithHeader>
					<h1> Recent Projects</h1>
					<ProjectGrid>
						{projects.slice(0, counts.projects).map((project) => (
							<ProjectCard key={project?._id} project={project} />
						))}
						{projects.length > counts.projects ? (
							<MoreButton onClick={() => showMore('projects')}>See More</MoreButton>
						) : null}
					</ProjectGrid>
				</ContainerWithHeader>
			) : null}

			{filter === 'all' || filter === 'articles' ? (
				<ContainerWithHeader>
					<h1> Recent Articles</h1>
					<ArticleContainer>
						{articles.slice(0, counts.articles).map((article) => (
							<ArticleCard key={article?._id} article={article} />
						))}
						{articles.length > counts.articles ? (
							<MoreButton onClick={() => showMore('articles')}>See More</MoreButton>
						) : null}
					</ArticleContainer>
				</ContainerWithHeader>
			) : null}
		</HomePageWrapper>
	);
}
